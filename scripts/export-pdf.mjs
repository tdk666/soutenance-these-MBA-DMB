/**
 * Le PDF de secours : une page par écran, à l'état final, plus la page de
 * garde. À produire après tout gel (`npm run pdf`), à copier sur une clé USB.
 * Si le jour J tout tombe, ce fichier se projette depuis n'importe quoi.
 */
import { chromium } from 'playwright-core';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const racine = resolve(import.meta.dirname, '..');
const url = `file://${racine}/dist/index.html`;
const dossier = mkdtempSync(join(tmpdir(), 'soutenance-pdf-'));
const cible = `${racine}/soutenance-secours.pdf`;

const navigateur = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await navigateur.newPage({ viewport: { width: 1920, height: 1080 } });

async function deck(fn, arg) {
  return page.evaluate(([f, a]) => {
    const d = window.__deck;
    if (f === 'aller') d.aller(a);
    else if (f === 'avancer') d.avancer();
    else if (f === 'reculer') d.reculer();
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
    if (apres.beatIndex === avant.beatIndex && apres.chaines === avant.chaines) return;
  }
}

await page.goto(url);
await page.waitForFunction(() => window.__deck !== undefined);
await page.waitForTimeout(2600);

const images = [];
await page.screenshot({ path: join(dossier, 'p00.png') });
images.push('p00.png');

const nb = await page.evaluate(() => window.__deck.ecrans.length);
for (let i = 0; i < nb; i++) {
  await etatFinalEcran(i);
  await page.waitForTimeout(1200);
  const nom = `p${String(i + 1).padStart(2, '0')}.png`;
  await page.screenshot({ path: join(dossier, nom) });
  images.push(nom);
  process.stdout.write('.');
}
console.log('');

// assemblage : un document 1920×1080 imprimé par le navigateur lui-même
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: 1920px 1080px; margin: 0; }
  html, body { margin: 0; padding: 0; }
  img { display: block; width: 1920px; height: 1080px; page-break-after: always; }
  img:last-child { page-break-after: auto; }
</style></head><body>${images
  .map((f) => `<img src="data:image/png;base64,${readFileSync(join(dossier, f)).toString('base64')}">`)
  .join('')}</body></html>`;
const chemin = join(dossier, 'livret.html');
writeFileSync(chemin, html);

const pageImpression = await navigateur.newPage();
await pageImpression.goto(`file://${chemin}`);
await pageImpression.pdf({
  path: cible,
  width: '1920px',
  height: '1080px',
  printBackground: true,
  pageRanges: '',
});

await navigateur.close();
rmSync(dossier, { recursive: true, force: true });
console.log(`PDF de secours : ${cible} (${images.length} pages)`);
