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

// les 21 écrans, à l'état final
for (let i = 0; i < 21; i++) {
  await etatFinalEcran(i);
  await page.waitForTimeout(1400);
  const id = String(i + 1).padStart(2, '0');
  await page.screenshot({ path: `${sortie}/ecran-${id}.png` });
  console.log(`ecran-${id}`);
}

// la grille (Échap)
await deck('aller', 8);
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
  d.aller(11); // E12
  d.chrono.demarrerOuPause();
  d.chrono.simuler(13 * 60_000 + 54_000); // 13:54, cible CP1 13:04
});
await pres.waitForTimeout(200);
await pres.evaluate(() => window.__deck.avancer()); // sortie E12 → constat CP1
await pres.waitForTimeout(600);
await pres.screenshot({ path: `${sortie}/presentateur.png` });
console.log('presentateur');

await navigateur.close();
