#!/usr/bin/env node
/**
 * Prüft relative Verweise in allen Markdown-Dateien.
 *
 * Warum das hier steht und nicht nur in der Anleitung: Eine Vorlage, die tote Verweise
 * enthält, widerspricht ihrer eigenen Kernregel. Der Prüflauf ist die Absicherung.
 *
 * Aufruf:  node tools/pruefe-verweise.mjs
 * Rückgabe: 0 = alles in Ordnung, 1 = tote Verweise gefunden
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const IGNORIERTE_ORDNER = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.github',
]);

function sammleMarkdown(ordner, gefunden = []) {
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    if (eintrag.name.startsWith('.') && eintrag.name !== '.github') continue;
    if (IGNORIERTE_ORDNER.has(eintrag.name)) continue;
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) sammleMarkdown(pfad, gefunden);
    else if (eintrag.name.endsWith('.md')) gefunden.push(pfad);
  }
  return gefunden;
}

/**
 * Entfernt eingezäunte Codeblöcke, bevor Verweise gesucht werden.
 *
 * Wichtig: In dieser Vorlage stehen in Codeblöcken **Beispiel**-Verweise auf Dateien,
 * die erst im Zielprojekt existieren (z. B. `docs/START.md`). Das sind Vorlagen, keine
 * Verweise dieses Repositories — sie dürfen nicht als tot gelten.
 */
function ohneCodebloecke(inhalt) {
  return inhalt.replace(/^```[\s\S]*?^```/gm, '');
}

/** [Text](ziel) — ohne Bilder, ohne reine Anker, ohne externe URLs */
function findeVerweise(inhalt) {
  const treffer = [];
  const muster = /\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = muster.exec(inhalt)) !== null) {
    const ziel = m[1].trim();
    if (
      ziel.startsWith('http://') ||
      ziel.startsWith('https://') ||
      ziel.startsWith('mailto:') ||
      ziel.startsWith('#')
    ) {
      continue;
    }
    treffer.push(ziel);
  }
  return treffer;
}

const dateien = sammleMarkdown(ROOT);
const fehler = [];
let geprueft = 0;

for (const datei of dateien) {
  const inhalt = ohneCodebloecke(readFileSync(datei, 'utf8'));
  for (const ziel of findeVerweise(inhalt)) {
    // Anker am Ende abschneiden: datei.md#abschnitt
    const ohneAnker = ziel.split('#')[0];
    if (!ohneAnker) continue;

    geprueft++;
    const pfad = resolve(dirname(datei), ohneAnker);

    if (!existsSync(pfad)) {
      fehler.push(`${datei.replace(ROOT + '\\', '').replace(ROOT + '/', '')} → ${ziel}`);
      continue;
    }
    // Auf Datei verweisen, nicht auf Ordner — sonst kein sinnvoller Inhalt
    if (statSync(pfad).isDirectory()) {
      fehler.push(
        `${datei.replace(ROOT + '\\', '').replace(ROOT + '/', '')} → ${ziel} (zeigt auf einen Ordner)`
      );
    }
  }
}

console.log(`Geprüft: ${dateien.length} Markdown-Dateien, ${geprueft} relative Verweise`);

if (fehler.length > 0) {
  console.error(`\nFEHLER: ${fehler.length} tote Verweise gefunden:\n`);
  for (const f of fehler) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('Alle relativen Verweise sind in Ordnung.');
