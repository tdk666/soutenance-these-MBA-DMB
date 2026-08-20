/**
 * Vérification visuelle : ouvre le build (file://, comme le jour J),
 * déroule chaque écran jusqu'à son état final via window.__deck,
 * capture en 1920×1080, plus la grille et le mode présentateur.
 * Sortie : captures-verification/ (non versionné).
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const racine = resolve(import.meta.dirname, '..');
const url = `file://${racine}/dist/index.html`;
const sortie = `${racine}/captures-verification`;
mkdirSync(sortie, { recursive: true });

const navigateur = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await navigateur.newPage({ viewport: { width: 1920, height: 1080 } });

async function deck(fn, arg) {
  return page.evaluate(([f, a]) => {
    const d = window.__deck;
    if (f === 'aller') d.aller(a);
    else if (f === 'avancer') d.avancer();
    else if (f === 'reculer') d.reculer();
    else if (f === 'simuler') d.chrono.simuler(a);
    return { ecran: d.ecran, beatIndex: d.beatIndex, chaines: d.chainesEnAttente };
  }, [fn, arg]);
}

async function etatFinalEcran(i) {
  await deck('aller', i);
  await page.waitForTimeout(120);
  for (let garde = 0; garde < 16; garde++) {
    const avant = await deck('avancer');
    await page.waitForTimeout(180);
    const apres = await page.evaluate(() => ({
      ecran: window.__deck.ecran,
      beatIndex: window.__deck.beatIndex,
      chaines: window.__deck.chainesEnAttente,
    }));
    if (apres.ecran !== avant.ecran) {
      await deck('reculer');
      await page.waitForTimeout(120);
      return;
    }
    // fin de séquence : plus rien n'a bougé (ni beat, ni chaîne)
    if (apres.beatIndex === avant.beatIndex && apres.chaines === avant.chaines) return;
  }
}

await page.goto(url);
await page.waitForFunction(() => window.__deck !== undefined);

// la page de garde, avant tout
await page.waitForTimeout(2600);
await page.screenshot({ path: `${sortie}/couverture.png` });
console.log('couverture');

/** détecte textes coupés et débordements : scrollWidth/Height des feuilles de
    texte, et boîtes qui sortent de la scène 1920×1080 */
const problemes = [];
async function detecterDebordements(nom) {
  const trouves = await page.evaluate(() => {
    const scene = document.querySelector('.scene');
    if (!scene) return [];
    const sc = scene.getBoundingClientRect();
    const echelle = sc.width / 1920;
    const anomalies = [];
    for (const el of scene.querySelectorAll('*')) {
      if (!(el instanceof HTMLElement)) continue;
      const texte = (el.childNodes[0]?.nodeType === 3 ? el.textContent : '') ?? '';
      // texte coupé dans sa propre boîte (tolérance de rendu 2px)
      if (
        texte.trim() &&
        (el.scrollHeight - el.clientHeight > 4 || el.scrollWidth - el.clientWidth > 4) &&
        getComputedStyle(el).overflow !== 'visible'
      ) {
        anomalies.push(`coupé: « ${texte.trim().slice(0, 40)} »`);
      }
      // boîte qui sort de la scène, dans les quatre directions; un élément
      // entièrement au-dessus ou à gauche est un texte disparu, pas un détail
      const r = el.getBoundingClientRect();
      if (
        texte.trim() &&
        (r.right > sc.right + 2 * echelle ||
          r.bottom > sc.bottom + 2 * echelle ||
          r.bottom < sc.top - 2 * echelle ||
          r.right < sc.left - 2 * echelle)
      ) {
        anomalies.push(`hors scène: « ${texte.trim().slice(0, 40)} »`);
      }
    }
    // chevauchements : deux textes non apparentés qui se recouvrent.
    // On mesure les glyphes réels (Range), pas les boîtes de bloc, et on
    // ignore ce que l'opacité héritée rend invisible.
    const opaciteEffective = (el) => {
      let o = 1;
      for (let n = el; n && n !== scene; n = n.parentElement) {
        o *= parseFloat(getComputedStyle(n).opacity || '1');
      }
      return o;
    };
    const feuilles = [...scene.querySelectorAll('*')]
      .filter(
        (el) =>
          el instanceof HTMLElement &&
          el.children.length === 0 &&
          (el.textContent ?? '').trim().length > 2 &&
          opaciteEffective(el) > 0.1,
      )
      .map((el) => {
        const plage = document.createRange();
        plage.selectNodeContents(el);
        return { el, rect: plage.getBoundingClientRect() };
      })
      .filter((f) => f.rect.width > 8 && f.rect.height > 4);
    for (let i = 0; i < feuilles.length; i++) {
      for (let j = i + 1; j < feuilles.length; j++) {
        const a = feuilles[i], b = feuilles[j];
        if (a.el.contains(b.el) || b.el.contains(a.el) || a.el.parentElement === b.el.parentElement) continue;
        const ra = a.rect, rb = b.rect;
        const ix = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const iy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (ix <= 0 || iy <= 0) continue;
        const inter = ix * iy;
        const petite = Math.min(ra.width * ra.height, rb.width * rb.height);
        if (inter > 0.35 * petite) {
          anomalies.push(
            `chevauchement: « ${(a.el.textContent ?? '').trim().slice(0, 24)} » / « ${(b.el.textContent ?? '').trim().slice(0, 24)} »`,
          );
        }
      }
    }
    return [...new Set(anomalies)].slice(0, 6);
  });
  for (const t of trouves) problemes.push(`${nom} · ${t}`);
}

const ecrans = await page.evaluate(() => window.__deck.ecrans);

// tous les écrans, à l'état final
for (let i = 0; i < ecrans.length; i++) {
  await etatFinalEcran(i);
  await page.waitForTimeout(1400);
  const id = String(i + 1).padStart(2, '0');
  await page.screenshot({ path: `${sortie}/ecran-${id}.png` });
  await detecterDebordements(`ecran-${id}`);
  console.log(`ecran-${id}`);
}

// les métamorphoses en séquence : trois images chacune, pour juger le mouvement
async function sequenceTransition(nom, prepare, declenche, tempsMs) {
  await prepare();
  await page.waitForTimeout(300);
  await declenche();
  const precedents = [];
  for (const t of tempsMs) {
    const attente = t - precedents.reduce((a, b) => a + b, 0);
    precedents.push(attente);
    await page.waitForTimeout(attente);
    await page.screenshot({ path: `${sortie}/morph-${nom}-${t}ms.png` });
  }
  console.log(`morph-${nom}`);
}

// l'amputation ÷2 (E09, beat « divise le nombre de jours par deux »)
await sequenceTransition(
  'amputation',
  async () => { await deck('aller', ecrans.indexOf('E11')); await deck('avancer'); },
  async () => { await deck('avancer'); },
  [400, 1100, 2200],
);

// pyramide → diamant (E14)
await sequenceTransition(
  'diamant',
  async () => { await deck('aller', ecrans.indexOf('E16')); },
  async () => { await deck('avancer'); },
  [300, 1000, 1900],
);

// strates → frise (entrée d'E19)
await sequenceTransition(
  'frise',
  async () => { await deck('aller', ecrans.indexOf('E20')); await deck('avancer'); await deck('avancer'); },
  async () => { await deck('avancer'); },
  [400, 1200, 2300],
);

// l'interlude de chapitre (entrée du bloc 4 « Le choc », E09 → E10)
await sequenceTransition(
  'interlude',
  async () => { await deck('aller', ecrans.indexOf('E09')); },
  async () => { await deck('avancer'); },
  [450, 950, 1450],
);

// le simulateur : la séquence des trois gestes
await deck('aller', ecrans.indexOf('E18'));
await page.waitForTimeout(800);
await page.screenshot({ path: `${sortie}/sim-geste-1-contrat.png` });
for (const [g, nom] of [[25, 'sim-geste-2a-mi-course'], [50, 'sim-geste-2b-choc']]) {
  await page.evaluate((v) => window.__sim.gain(v), g);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${sortie}/${nom}.png` });
}
await page.evaluate(() => window.__sim.bascule(true));
await page.waitForTimeout(1400);
await page.screenshot({ path: `${sortie}/sim-geste-3-bascule.png` });
await page.evaluate(() => window.__sim.hypotheses(true));
await page.waitForTimeout(600);
await page.screenshot({ path: `${sortie}/sim-hypotheses.png` });
await page.evaluate(() => {
  window.__sim.hypotheses(false);
  window.__sim.bascule(false);
  window.__sim.gain(0);
});
console.log('simulateur');

// la grille (Échap)
await deck('aller', ecrans.indexOf('E11'));
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
await page.screenshot({ path: `${sortie}/grille.png` });
console.log('grille');
await page.keyboard.press('Escape');

// le mode présentateur, avec un constat de checkpoint simulé :
// retard de 50 s à la sortie d'E12 (CP1) → « armer C3 »
const pres = await navigateur.newPage({ viewport: { width: 1440, height: 900 } });
await pres.goto(`${url}?vue=presentateur`);
await pres.waitForFunction(() => window.__deck !== undefined);
await pres.evaluate(() => {
  const d = window.__deck;
  d.aller(d.ecrans.indexOf('E14')); // fin du bloc 4
  d.chrono.demarrerOuPause();
  d.chrono.simuler(14 * 60_000 + 14_000); // 14:14, cible CP1 13:24
});
await pres.waitForTimeout(200);
await pres.evaluate(() => window.__deck.avancer()); // sortie E12 → constat CP1
await pres.waitForTimeout(600);
await pres.screenshot({ path: `${sortie}/presentateur.png` });
console.log('presentateur');

if (problemes.length > 0) {
  console.log('\nDÉBORDEMENTS DÉTECTÉS :');
  for (const p of problemes) console.log(`  ! ${p}`);
} else {
  console.log('\naucun texte coupé, aucun débordement');
}

await navigateur.close();
process.exit(problemes.length > 0 ? 2 : 0);
