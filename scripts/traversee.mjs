/**
 * La traversée complète : rejoue tous les gestes du jour J dans l'ordre, du
 * premier appui (sortie de la page de garde) au colophon, photographie
 * chaque état dans captures-verification/traversee/ et vérifie à chaque
 * arrêt : textes coupés, hors scène (quatre directions), corps sous 28 px.
 * C'est le contrôle qui aurait attrapé la frise de parcours : l'état final
 * d'un écran ne suffit pas, chaque état intermédiaire compte.
 * `npm run traversee` après tout changement transversal.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, rmSync } from 'node:fs';
// repartir d'un dossier vide : un fichier d'une numérotation antérieure
// survivrait au renommage des états et fausserait la captation
rmSync('captures-verification/traversee', { recursive: true, force: true });
mkdirSync('captures-verification/traversee', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await page.goto('file://' + process.cwd() + '/dist/index.html');
await page.waitForFunction(() => window.__deck !== undefined);
await page.waitForTimeout(2600);
const problemes = [];
async function detecter(nom) {
  const trouves = await page.evaluate(() => {
    const scene = document.querySelector('.scene');
    if (!scene) return [];
    const sc = scene.getBoundingClientRect();
    const e = sc.width / 1920;
    const anomalies = [];
    for (const el of scene.querySelectorAll('*')) {
      if (!(el instanceof HTMLElement)) continue;
      const texte = (el.childNodes[0]?.nodeType === 3 ? el.textContent : '') ?? '';
      if (!texte.trim()) continue;
      if ((el.scrollHeight - el.clientHeight > 4 || el.scrollWidth - el.clientWidth > 4) && getComputedStyle(el).overflow !== 'visible')
        anomalies.push(`coupé: « ${texte.trim().slice(0, 50)} »`);
      const r = el.getBoundingClientRect();
      if (r.right > sc.right + 2 * e || r.bottom > sc.bottom + 2 * e || r.bottom < sc.top - 2 * e || r.right < sc.left - 2 * e)
        anomalies.push(`hors scène: « ${texte.trim().slice(0, 50)} »`);
      const cs = getComputedStyle(el);
      if (el.children.length === 0 && parseFloat(cs.fontSize) < 27.5 && r.width > 4)
        anomalies.push(`corps < 28px (${cs.fontSize}): « ${texte.trim().slice(0, 40)} »`);
    }
    return [...new Set(anomalies)].slice(0, 8);
  });
  for (const t of trouves) problemes.push(`${nom} · ${t}`);
}
// la page de garde
await page.screenshot({ path: 'captures-verification/traversee/000-couverture.png' });
await detecter('couverture');
// la première flèche quitte la page de garde sans bouger la régie
await page.evaluate(() => window.__deck.avancer());
await page.waitForTimeout(1200);
await page.screenshot({ path: 'captures-verification/traversee/001-E01-b0.png' });
await detecter('001-E01-b0');
// traversée intégrale au geste, comme le jour J
let n = 1;
for (let garde = 0; garde < 120; garde++) {
  const avant = await page.evaluate(() => ({ b: window.__deck.beatIndex, c: window.__deck.chainesEnAttente, e: window.__deck.ecran }));
  await page.evaluate(() => window.__deck.avancer());
  // laisser les entrées, chaînes et interludes se poser
  await page.waitForTimeout(2600);
  const apres = await page.evaluate(() => ({ b: window.__deck.beatIndex, c: window.__deck.chainesEnAttente, e: window.__deck.ecran }));
  if (apres.b === avant.b && apres.c === avant.c && apres.e === avant.e) break;
  n += 1;
  const nom = `${String(n).padStart(3, '0')}-${apres.e}-b${apres.b}`;
  await page.screenshot({ path: `captures-verification/traversee/${nom}.png` });
  await detecter(nom);
}
console.log(`gestes traversés : ${n}`);
if (problemes.length) { console.log('PROBLÈMES :'); problemes.forEach((p) => console.log(' -', p)); process.exitCode = 2; }
else console.log('traversée propre : aucun texte coupé, hors scène ou trop petit, à aucun état');
await b.close();
