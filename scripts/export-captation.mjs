/**
 * La captation : le dossier qui permet à un évaluateur externe (coach, sosie
 * de jury) de vivre la soutenance en conditions réelles sans le logiciel.
 * Trois parties : le film de la projection (les 42 états dans l'ordre exact
 * des 40 appuis, légendés avec les mots qui les déclenchent), les
 * métamorphoses en mouvement, et le texte intégral de l'oral (livrable A,
 * reproduit à l'identique). Prérequis : `npm run traversee` et
 * `npm run capture` (les images sources). Sortie : public/soutenance-captation.pdf,
 * committée et servie par Netlify (un évaluateur distant y accède par URL).
 */
import { chromium } from 'playwright-core';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const racine = resolve(import.meta.dirname, '..');
const dossierTraversee = join(racine, 'captures-verification', 'traversee');
const dossierCaptures = join(racine, 'captures-verification');
const cible = join(racine, 'public', 'soutenance-captation.pdf');
const tmp = mkdtempSync(join(tmpdir(), 'captation-'));

/* ── la chaîne des gestes, parsée depuis le doc généré du config ── */
const chaine = readFileSync(join(racine, 'docs', 'chaine-des-gestes.md'), 'utf8');
const gestes = new Map();
for (const ligne of chaine.split('\n')) {
  let m = ligne.match(/^\| (\d+) \| bascule vers \*\*(.+?)\*\* \| .*? \| (.+?) \|$/);
  if (m) {
    gestes.set(Number(m[1]), { type: 'bascule', ecran: m[2], detail: m[3] });
    continue;
  }
  m = ligne.match(/^\| (\d+) \| révélation sur (\S+) \| (.+?) \| (.+?) \|$/);
  if (m) gestes.set(Number(m[1]), { type: 'revelation', ecran: `${m[2]} · ${m[3]}`, detail: m[4] });
}
if (gestes.size !== 40) throw new Error(`chaîne des gestes : ${gestes.size} lignes lues, 40 attendues`);

/* ── réencodage des images en JPEG (pas d'outil externe : Chromium) ── */
const L = 1536, H = 864; // 16:9, assez fin pour lire chaque mot de l'écran
const navigateur = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const encodeur = await navigateur.newPage({ viewport: { width: L, height: H } });
async function versJpeg(cheminPng, nomJpeg) {
  // data URI : une page setContent vit sur about:blank, qui ne peut pas
  // charger de sous-ressource file:// (l'image resterait blanche)
  const src = `data:image/png;base64,${readFileSync(cheminPng).toString('base64')}`;
  await encodeur.setContent(
    `<style>*{margin:0;padding:0}</style><img src="${src}" style="width:${L}px;height:${H}px;display:block">`,
  );
  await encodeur.waitForFunction(
    () => document.querySelector('img')?.complete && document.querySelector('img')?.naturalWidth > 0,
  );
  await encodeur.screenshot({ path: join(tmp, nomJpeg), type: 'jpeg', quality: 82 });
  return nomJpeg;
}

const fichiersTraversee = readdirSync(dossierTraversee).filter((f) => f.endsWith('.png')).sort();
const film = [];
for (const f of fichiersTraversee) {
  film.push({ png: f, jpeg: await versJpeg(join(dossierTraversee, f), f.replace('.png', '.jpg')) });
  process.stdout.write('.');
}
const morphs = {};
for (const nom of ['amputation', 'diamant', 'frise', 'interlude']) {
  const frames = readdirSync(dossierCaptures)
    .filter((f) => f.startsWith(`morph-${nom}-`) && f.endsWith('.png'))
    .sort((a, b) => parseInt(a.match(/(\d+)ms/)[1], 10) - parseInt(b.match(/(\d+)ms/)[1], 10));
  morphs[nom] = [];
  for (const f of frames) {
    morphs[nom].push({ ms: f.match(/(\d+)ms/)[1], jpeg: await versJpeg(join(dossierCaptures, f), f.replace('.png', '.jpg')) });
    process.stdout.write('.');
  }
}
console.log('');

/* ── petites aides ── */
const echappe = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// typographie française des textes que ce script compose (jamais le script v3)
const typo = (s) =>
  s.replace(/« /g, '« ').replace(/ »/g, ' »').replace(/ ([:;?!])/g, ' $1');
const img64 = (jpeg) => `data:image/jpeg;base64,${readFileSync(join(tmp, jpeg)).toString('base64')}`;

/* ── le texte de l'oral : markdown → HTML minimal, contenu intact ── */
function mdVersHtml(md) {
  const lignes = md.split('\n');
  const out = [];
  let tableau = null;
  const videTableau = () => {
    if (!tableau) return;
    out.push('<table>' + tableau.map((r, i) =>
      `<tr>${r.map((c) => `<${i === 0 ? 'th' : 'td'}>${enLigne(c)}</${i === 0 ? 'th' : 'td'}>`).join('')}</tr>`,
    ).join('') + '</table>');
    tableau = null;
  };
  const enLigne = (s) => echappe(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  for (const brute of lignes) {
    const l = brute.trimEnd();
    if (/^\|/.test(l)) {
      const cellules = l.split('|').slice(1, -1).map((c) => c.trim());
      if (cellules.every((c) => /^:?-+:?$/.test(c))) continue;
      (tableau ??= []).push(cellules);
      continue;
    }
    videTableau();
    if (l.startsWith('## ')) out.push(`<h2>${enLigne(l.slice(3))}</h2>`);
    else if (l.startsWith('# ')) out.push(`<h1>${enLigne(l.slice(2))}</h1>`);
    else if (l === '') out.push('');
    else {
      const classe = /^\*\*\[(ÉCRAN|SIMULATEUR)/.test(l) ? ' class="ecran"' : '';
      out.push(`<p${classe}>${enLigne(l)}</p>`);
    }
  }
  videTableau();
  return out.join('\n');
}
const scriptOral = mdVersHtml(readFileSync(join(racine, 'docs', 'script-soutenance-v3.md'), 'utf8'));

/* ── les pages du film ── */
function pageFilm({ jpeg }, indexEtat) {
  let titre, detail;
  if (indexEtat === 0) {
    titre = 'Avant la soutenance · la page de garde';
    detail = 'Ce que le jury voit en s’installant, avant la première parole.';
  } else if (indexEtat === 1) {
    titre = 'État initial · E01, l’écran noir de l’adresse';
    detail = 'Le premier appui a effacé la page de garde. La parole commence, 0:00.';
  } else {
    const n = indexEtat - 1;
    const g = gestes.get(n);
    titre = g.type === 'bascule'
      ? `Geste ${n} · bascule vers ${g.ecran}`
      : `Geste ${n} · révélation sur ${g.ecran}`;
    detail = g.type === 'bascule'
      ? `À la fin de l’écran précédent · ${g.detail}`
      : `Déclenchée sur les mots prononcés : ${g.detail}`;
  }
  const etat = indexEtat === 0 ? '' : `<span class="etat">état ${indexEtat} / 41</span>`;
  return `<section class="page film">
    <img src="${img64(jpeg)}">
    <div class="legende"><p class="titre">${typo(echappe(titre))}${etat}</p>
    <p class="detail">${typo(echappe(detail))}</p></div>
  </section>`;
}

const nomsMorphs = {
  amputation: 'L’amputation des journées (E11) : la barre perd la moitié de ses jours pendant que la phrase est prononcée.',
  diamant: 'La pyramide des talents devient diamant (E16), sur « devient un diamant ».',
  frise: 'Les strates du prix étagé se couchent en frise des vingt-quatre mois, à l’entrée du bloc 7.',
  interlude: 'L’interlude de chapitre : le nom du bloc s’affiche seul entre deux écrans, puis se dissout.',
};

/* ── le document ── */
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  @page { size: ${L}px 1080px; margin: 0; }
  html, body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; color: #10131f; }
  .page { width: ${L}px; height: 1080px; page-break-after: always; overflow: hidden; position: relative; background: #fff; }
  .film img { width: ${L}px; height: ${H}px; display: block; }
  .legende { padding: 26px 56px; }
  .legende .titre { font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 34px; margin: 0 0 10px; }
  .legende .detail { font-size: 30px; font-style: italic; margin: 0; color: #3a3f52; }
  .legende .etat { float: right; font-weight: 400; font-size: 26px; color: #8b8fa3; font-style: normal; }
  .garde { background: #10131f; color: #f5f3ee; padding: 72px 120px 48px; box-sizing: border-box; }
  .garde h1 { font-size: 74px; line-height: 1.06; margin: 0 0 14px; font-weight: 700; }
  .garde .sous { font-size: 34px; color: #e8b400; margin: 0 0 40px; }
  .garde p, .garde li { font-size: 28px; line-height: 1.42; }
  .garde p { margin: 0 0 20px; }
  .garde ol { padding-left: 44px; margin: 0 0 20px; }
  .garde li { margin-bottom: 10px; }
  .intercalaire { background: #10131f; color: #f5f3ee; display: flex; align-items: center; justify-content: center; }
  .intercalaire h1 { font-size: 72px; font-weight: 700; text-align: center; line-height: 1.15; padding: 0 140px; }
  .morphs { padding: 60px 56px; box-sizing: border-box; }
  .morphs h2 { font-family: Arial, Helvetica, sans-serif; font-size: 34px; margin: 0 0 22px; }
  .rangee { display: flex; gap: 18px; margin-bottom: 16px; }
  .rangee figure { margin: 0; }
  .rangee img { width: 460px; height: 259px; display: block; border: 1px solid #d8d5cc; }
  .rangee figcaption { font-family: Arial, sans-serif; font-size: 22px; color: #8b8fa3; margin-top: 6px; }
  .oral { padding: 90px 168px; box-sizing: border-box; }
  .oral h1 { font-size: 54px; margin: 0 0 40px; }
  .oral h2 { font-size: 40px; margin: 64px 0 24px; }
  .oral p { font-size: 29px; line-height: 1.55; margin: 0 0 22px; }
  .oral p.ecran { background: #f5f3ee; border-left: 6px solid #e8b400; padding: 14px 22px; font-family: Arial, sans-serif; font-size: 26px; }
  .oral table { border-collapse: collapse; margin: 0 0 26px; font-size: 25px; font-family: Arial, sans-serif; }
  .oral th, .oral td { border: 1px solid #c9c6bd; padding: 10px 16px; text-align: left; vertical-align: top; }
  .oral th { background: #f5f3ee; }
</style></head><body>

<section class="page garde">
  <h1>La soutenance,<br>en conditions réelles</h1>
  <p class="sous">Captation intégrale pour évaluation</p>
  <p>Théophile Dequecker · MBA Digital Marketing &amp; Business, EFAP Paris<br>
  Jeudi 4 septembre 2026, 14 h · durée : 30 minutes, puis questions · projection 16:9 plein écran</p>
  <p>Ce dossier restitue la soutenance telle qu’elle se jouera. Trois parties :</p>
  <ol>
    <li><strong>Le film de la projection.</strong> Les 41 états de l’écran, dans l’ordre exact des 40 appuis du présentateur, précédés de la page de garde. Chaque page indique le geste qui produit l’image et les mots prononcés à cet instant précis.</li>
    <li><strong>Les métamorphoses en mouvement.</strong> Le jour J, un même objet graphique se transforme en continu sous les yeux du jury ; quatre séquences sont données en trois instants.</li>
    <li><strong>Le texte intégral de l’oral</strong> (version 3), calibré à 120 mots par minute, avec ses marqueurs d’écran, son chrono par bloc, ses coupes et ses réserves.</li>
  </ol>
  <p>Règle de lecture : l’écran n’anticipe jamais la parole. Chaque image n’apparaît qu’au moment où les mots qui la déclenchent sont prononcés. Ce document est une captation, pas le support : le jour J, rien de ce qui suit n’est distribué au jury.</p>
</section>

<section class="page intercalaire"><h1>Première partie<br>Le film de la projection</h1></section>
${film.map((f, i) => pageFilm(f, i)).join('\n')}

<section class="page intercalaire"><h1>Deuxième partie<br>Les métamorphoses en mouvement</h1></section>
<section class="page morphs">
${['amputation', 'diamant'].map((nom) => `<h2>${typo(echappe(nomsMorphs[nom]))}</h2>
  <div class="rangee">${morphs[nom].map((m) => `<figure><img src="${img64(m.jpeg)}"><figcaption>${m.ms} ms</figcaption></figure>`).join('')}</div>`).join('\n')}
</section>
<section class="page morphs">
${['frise', 'interlude'].map((nom) => `<h2>${typo(echappe(nomsMorphs[nom]))}</h2>
  <div class="rangee">${morphs[nom].map((m) => `<figure><img src="${img64(m.jpeg)}"><figcaption>${m.ms} ms</figcaption></figure>`).join('')}</div>`).join('\n')}
</section>

<section class="page intercalaire"><h1>Troisième partie<br>Le texte intégral de l’oral</h1></section>
<div class="oral">
${scriptOral}
</div>

</body></html>`;

const chemin = join(tmp, 'captation.html');
writeFileSync(chemin, html);
const impression = await navigateur.newPage();
await impression.goto(`file://${chemin}`);
await impression.pdf({ path: cible, width: `${L}px`, height: '1080px', printBackground: true });
await navigateur.close();
rmSync(tmp, { recursive: true, force: true });
console.log(`captation : ${cible}`);
