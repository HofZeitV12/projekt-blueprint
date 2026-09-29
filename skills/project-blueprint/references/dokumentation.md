# Dokumentation

Der Teil, der ein Projekt nach drei Monaten noch benutzbar macht. Ohne ihn ist jeder Neuein-
stieg ein Rätselraten und jede Entscheidung wird neu diskutiert.

## Die vier Ebenen

Jede Datei hat **eine** Leserschaft und **einen** Zweck. Vermischung ist der Grund, warum
Dokumentation ungelesen bleibt.

| Ebene | Datei | Leser | Frage, die sie beantwortet | Aktualisiert |
|---|---|---|---|---|
| Einstieg | `docs/START.md` | Neueinsteiger, Assistent | „Wo fange ich an?" | bei Richtungswechsel |
| Projektbild | `docs/PROJEKT.md` | alle | „Was ist das, und was nicht?" | bei Zweck-/Umfangsänderung |
| Entscheidungen | `docs/entscheidungen/NNNN-*.md` | wer später „warum?" fragt | „Warum ist das so?" | **vor** der Umsetzung |
| Betrieb | `docs/RUNBOOK.md` | wer nachts reparieren muss | „Was tue ich jetzt?" | bei jedem Vorfall |

Dazu im Wurzelverzeichnis: `README.md`, `CHANGELOG.md`, `AGENTS.md`.

---

## `README.md` — die Haustür

Maximal eine Bildschirmseite. Kein Roman.

```markdown
# <Projektname>

<Ein Satz: was es ist und für wen.>

**Stand:** JJJJ-MM-TT

## Schnellstart

\`\`\`bash
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev
\`\`\`

## Prüfen

\`\`\`bash
npm run check
\`\`\`

## Wo weiterlesen

- [Einstieg für Mitarbeitende](docs/START.md)
- [Projektbild und Umfang](docs/PROJEKT.md)
- [Entscheidungen](docs/entscheidungen/)
- [Betrieb](docs/RUNBOOK.md)
```

Regeln: Der Schnellstart muss **kopierbar funktionieren**. Ein Schnellstart, der nicht läuft,
ist schlimmer als keiner.

---

## `docs/START.md` — die einzige Tür

Wer hier ankommt, findet innerhalb von **zwei Klicks** alles. Der Index ist vollständig und
aktuell — ein toter Verweis ist ein Fehler, kein Schönheitsproblem.

```markdown
# Einstieg

**Stand:** JJJJ-MM-TT · **Letzte Änderung an der Struktur:** JJJJ-MM-TT

## In welcher Reihenfolge lesen

| # | Datei | Warum |
|---|---|---|
| 1 | [Projektbild](PROJEKT.md) | Zweck, Umfang, Kerntabellen |
| 2 | [Aktueller Stand](#aktueller-stand) | Was läuft, was nicht |
| 3 | [Entscheidungen](entscheidungen/) | Warum es so ist |
| 4 | [Runbook](RUNBOOK.md) | Was im Störfall zu tun ist |
| 5 | [Konventionen](#konventionen) | Wie hier gearbeitet wird |

## Aktueller Stand

**Läuft:** …
**Läuft nicht / unvollständig:** …
**Bekannte Probleme:** …

## Offene Aufgaben

| # | Aufgabe | Warum | Größe |
|---|---|---|---|
| 1 | … | … | klein / mittel / groß |

## Wo die Dinge liegen

| Was | Wo |
|---|---|
| Anwendung | `app/` |
| Fachlogik | `lib/` |
| Datenbankschema | `db/migrations/` |
| Betriebsskripte | `tools/` |
| Dokumentation | `docs/` |

## Konventionen

- Migrationen: `JJJJMMTTHHMMSS_kurz_slug.sql`, **rein additiv**
- Werte (Preise, Grenzen, Aufzählungen): **eine** Datei, siehe [Entscheidungen](entscheidungen/)
- Nach jeder Schemaänderung: Typen neu generieren, `npm run check`
- Nach jedem Feature: Stand in dieser Datei aktualisieren

## Nächster sinnvoller Schritt

<Konkret, nicht „weiterentwickeln".>
```

**Der Abschnitt „Aktueller Stand" ist der wichtigste.** Er ist die einzige Stelle, an der
jemand ohne Vorwissen sieht, was tatsächlich funktioniert. Er veraltet als Erstes — und muss
deshalb bei jedem Feature mitgezogen werden.

---

## `docs/PROJEKT.md` — Projektbild

Aus dem Intake (siehe `intake.md`) entstanden. Beantwortet, was das Projekt ist und was es
**nicht** ist.

```markdown
# Projektbild

**Stand:** JJJJ-MM-TT

## Zweck

<Zwei bis drei Sätze. Wem hilft es, wobei.>

## Nutzer

| Rolle | Tut hauptsächlich |
|---|---|
| … | … |

## Ausdrücklich nicht im Umfang

- …
- …

> Dieser Abschnitt ist keine Nebensache. Er verhindert, dass Anfragen angenommen werden, die
> das Projekt in eine andere Richtung ziehen.

## Kernbegriffe

| Begriff | Bedeutung im Projekt | Nicht verwechseln mit |
|---|---|---|
| … | … | … |

## Kerntabellen

| Tabelle | Zweck | Personenbezogen? |
|---|---|---|
| … | … | ja / nein |

## Sprachen und Formate

- Oberfläche: …
- Dokumentation: …
- Volltextsuche: Sprachkonfiguration …

## Offene Fragen

| # | Frage | Seit | Blockiert |
|---|---|---|---|
| 1 | … | JJJJ-MM-TT | nein |
```

---

## `docs/entscheidungen/NNNN-*.md` — Architekturentscheidungen

**Die wichtigste Dokumentationsform überhaupt.** Sie beantwortet die Frage, die in sechs
Monaten gestellt wird: „Warum ist das so?" — und verhindert, dass eine verworfene Idee
dreimal neu diskutiert wird.

Format: fortlaufend nummeriert, vier Stellen, kurzer Titel.
Beispiel: `docs/entscheidungen/0007-hybridsuche-statt-reiner-vektorsuche.md`

```markdown
# 0007 – Hybridsuche statt reiner Vektorsuche

**Datum:** JJJJ-MM-TT
**Status:** angenommen | offen | ersetzt durch [0012](0012-….md)

## Auslöser

Was war der Anlass? Nicht „wir wollen Qualität verbessern", sondern das konkrete Ereignis:
eine fehlerhafte Suche, eine Messung, ein Vorfall, eine Anforderung.

## Entscheidung

Was gilt ab jetzt, in einem Satz, dann die Begründung.

## Verworfene Alternativen

| Alternative | Warum verworfen |
|---|---|
| Nur Vektorsuche | findet Eigennamen und Nummern nicht zuverlässig |
| Nur Volltextsuche | findet Umschreibungen nicht |

> Dieser Abschnitt ist der wertvollste. Wer in einem halben Jahr die Alternative vorschlägt,
> liest hier, warum sie es nicht wurde.

## Folgen

**Positiv:** …
**Negativ / Schuld:** … (was wird dadurch schwieriger)
**Nachziehen:** welche Dokumente/Rules dadurch veralten

## Belege

Messergebnisse, Protokolle, Befehle — was diese Entscheidung stützt.
```

Regeln:

1. **Vor** der Umsetzung schreiben. Hinterher geschriebene Entscheidungen sind Rechtfertigung,
   nicht Dokumentation.
2. **Eine Entscheidung pro Datei.** Sonst findet sie niemand.
3. **Status pflegen.** Wird eine Entscheidung ersetzt, bekommt die alte
   `ersetzt durch NNNN` und bleibt stehen. **Nicht löschen** — die Begründung bleibt gültig.
4. **Auch kleine Entscheidungen.** „Warum liegt das in `lib/` und nicht in `app/`" ist eine
   Frage, die gestellt wird.
5. **Auch Fehlentscheidungen.** Ein Eintrag, der später korrigiert wird, ist wertvoller als
   keiner.

---

## `docs/RUNBOOK.md` — Betrieb

Für den Moment, in dem niemand nachdenken möchte. **Jede Handlung mit echtem Befehl.**

```markdown
# Runbook

**Stand:** JJJJ-MM-TT

## Wichtige Adressen

| Was | Adresse | Zugang |
|---|---|---|
| Produktivsystem | … | … |
| Übersicht/Protokolle | … | … |
| Datenbank | … | nur server- und konsolenseitig |

> **Hier stehen keine Zugangsdaten** — nur, wo sie liegen und wer sie hat.

## Erste Schritte bei einem Problem

1. Erreichbarkeit prüfen: `curl -s -o /dev/null -w "%{http_code}" <adresse>`
2. Protokolle der letzten Stunde ansehen (Ort: …)
3. Letzten Deploy prüfen — was hat sich geändert?
4. Wenn ein Deploy die Ursache ist: **zurückrollen**, nicht vorwärts reparieren.

## Wiederkehrende Handlungen

### Deploy zurückrollen
\`\`\`bash
<echter Befehl>
\`\`\`

### Datenbankzustand prüfen
\`\`\`sql
select count(*) from …;
\`\`\`

### Warteschlange hängt
\`\`\`bash
<echter Befehl>
\`\`\`

## Störfälle, die schon vorkamen

| Symptom | Ursache | Behebung | Datum |
|---|---|---|---|
| … | … | … | JJJJ-MM-TT |

## Wartung

| Aufgabe | Rhythmus | Befehl |
|---|---|---|
| Abzug sichern | … | … |
| Abgelaufenes aufräumen | … | … |
| Suche messen | … | … |
| Abhängigkeiten aktualisieren | … | … |
```

Regeln: **Nach jedem Vorfall ein Eintrag.** Nicht weil es Vorschrift ist, sondern weil derselbe
Vorfall sonst wiederkommt. Ein Runbook ohne Störfall-Tabelle ist eine Theorie.

---

## `CHANGELOG.md` — was sich geändert hat

Nach *Keep a Changelog*, Datum und Version.

```markdown
# Änderungen

## [Nicht veröffentlicht]

### Hinzugefügt
- …

### Geändert
- …

### Behoben
- …

## [1.2.0] – JJJJ-MM-TT

### Geändert
- **Bruch:** `GET /api/…` liefert jetzt ein Objekt statt einer Liste
```

Regeln: **Bruchstellen ausdrücklich kennzeichnen.** Beim Rückwärtslesen ist das die einzige
Zeile, die zählt. Ein Changelog, das nur „Verbesserungen" sammelt, ist wertlos.

---

## `AGENTS.md` — Konventionen für Assistenten

Im Wurzelverzeichnis, damit es auch außerhalb von Cursor gelesen wird.

```markdown
# Konventionen

## Projekt in Kürze

<Zwei Sätze, plus Verweis auf docs/PROJEKT.md>

## Befehle

| Zweck | Befehl |
|---|---|
| Entwicklung | `npm run dev` |
| Alles prüfen | `npm run check` |
| Typen neu | `npm run types` |

## Wie hier gearbeitet wird

1. Erst lesen, dann ändern. Nie aus dem Gedächtnis annehmen.
2. Jede Aussage über den Zustand braucht einen ausgeführten Befehl.
3. Kleinste sinnvolle Änderung.
4. Konventionen des Projekts übernehmen, nicht die eigenen.

## Nach jedem Feature

- [ ] Entscheidungseintrag (falls nicht offensichtlich)
- [ ] Stand in `docs/START.md` aktualisiert
- [ ] `CHANGELOG.md` ergänzt
- [ ] `npm run check` grün

## Bekannte Fallen

<Verweis auf regeln-und-fallen.md bzw. project-eigene Liste>
```

---

## Datensatzverzeichnis

**Pflicht, sobald personenbezogene Daten vorkommen.** Nicht zu verwechseln mit der technischen
Tabellenliste.

```markdown
# Datensatzverzeichnis

**Stand:** JJJJ-MM-TT

| Datensatz | Zweck | Kategorien | Betroffen | Grundlage | Aufbewahrung | Empfänger |
|---|---|---|---|---|---|---|
| Bestellungen | Vertragsabwicklung | Name, Adresse, Kontakt | Kunden | Vertrag | 10 Jahre (Handelsrecht) | Zahlungsdienstleister |
| Serverprotokolle | Betriebssicherheit | IP, Zeitpunkt | Besucher | berechtigtes Interesse | 7 Tage | – |
| Newsletter | Versand | E-Mail | Interessenten | Einwilligung | bis Widerruf | Versanddienstleister |
```

Regeln:

- **Jede Tabelle mit personenbezogenen Daten braucht eine Zeile.** Fehlt eine, ist das
  Verzeichnis unvollständig.
- **Aufbewahrung ist konkret.** „So lange wie nötig" ist kein Eintrag. Eine Frist, ein Zweck.
- **Löschung muss durchführbar sein.** Ein Eintrag ohne Weg zum Löschen ist eine Absicht, keine
  Umsetzung.
- **Auftragsbearbeitung:** Bei jedem externen Dienst, der personenbezogene Daten verarbeitet,
  Vertrag und Ort der Verarbeitung festhalten.

---

## Glossar

Kurz halten, aber vorhanden. Nur Begriffe, die im Projekt eine **spezifische** Bedeutung haben.

```markdown
| Begriff | Bedeutung im Projekt | Nicht verwechseln mit |
|---|---|---|
| Slot | reservierter Zeitraum in der Planung | „Termin" — der ist die Bestätigung |
```

Ein Glossar mit Allgemeinplätzen ist Ballast. Ein Glossar mit den drei Begriffen, die im
Projekt anders verwendet werden als erwartet, spart Stunden.

---

## Wo liegen die Werte?

**Niemals die Werte in die Dokumentation.** Nur, wo sie liegen und wer sie hat.

```markdown
# Zugänge (Register)

| Dienst | Zweck | Wo hinterlegt | Wer hat Zugriff | Rotationsrhythmus |
|---|---|---|---|---|
| Datenbank | … | Hosting-Variablen + `.env.local` | … | … |
| Zahlungsdienst | … | … | … | … |
| Repository | … | Kontoeinstellungen | … | … |
```

Regeln: Nur **Fundorte**, keine Werte, keine Ausschnitte, keine Teile. Auch nicht „beginnt mit
`sk_live_…`" — das ist schon eine Information.

---

## Die fünf Regeln, die den Unterschied machen

1. **Entscheidungen vor der Umsetzung.** Nicht danach.
2. **Jede Datei trägt einen Stand.** Datum oben, ohne Ausnahme.
3. **Ein Index verlinkt alles.** `docs/START.md` ist die einzige Tür.
4. **Veraltetes korrigieren oder löschen, nie ergänzen.** Ein Abschnitt „das gilt nicht mehr"
   ist eine Falle. Alte Fassung ersetzen.
5. **Der Code gewinnt.** Widerspricht eine Aussage dem Code, wird sie korrigiert — nicht
   relativiert.

---

## Dokumentation prüfen

Ein Projekt ist nicht dokumentiert, weil Dateien existieren, sondern weil sie **stimmen**.

| Prüfung | Befehl / Vorgehen | Erwartet |
|---|---|---|
| Tote Verweise | jeden Link in `docs/START.md` öffnen | alle vorhanden |
| Stand aktuell | Stand-Datum gegen letzten Commit prüfen | passt |
| Einstieg vollständig | eine fremde Person liest `START.md` und startet das Projekt | gelingt ohne Rückfragen |
| Schnellstart läuft | `README.md` in einer frischen Kopie durchspielen | gelingt |
| Entscheidungen vorhanden | jede nicht offensichtliche Struktur hat einen Eintrag | ja |
| Datensatzverzeichnis vollständig | jede Tabelle mit personenbezogenen Daten hat eine Zeile | ja |
| Runbook belastbar | Störfall-Tabelle hat Einträge | ja |
| Changelog gepflegt | letzte Änderung datiert und beschrieben | ja |
| Widerspruchsfreiheit | Aussagen gegen Code prüfen | keine Widersprüche |

**Der entscheidende Test:** Eine Person, die das Projekt nicht kennt, kann anhand von
`README.md` und `docs/START.md` ohne Rückfragen starten, prüfen und den nächsten Schritt
erkennen. Wenn sie fragen muss, ist die Dokumentation unvollständig — unabhängig davon, wie
viele Seiten sie hat.

---

## Pflege im Alltag

Jede Änderung zieht Dokumentation nach, **im selben Vorgang**:

| Änderung | Nachziehen |
|---|---|
| Neues Feature | `START.md` → Stand; `CHANGELOG.md` → Hinzugefügt |
| Schemaänderung | `CHANGELOG.md`; Datensatzverzeichnis bei personenbezogenen Daten |
| Umbenennung | alle Verweise, `Glossar` |
| Neue externe Abhängigkeit | Zugangsregister, Datensatzverzeichnis |
| Architekturentscheidung | **Entscheidungseintrag** |
| Vorfall | `RUNBOOK.md` → Störfälle |
| Neuer Befehl | `README.md`, `AGENTS.md` → Befehle |

**Nicht** sammeln und später nachtragen. Später ist der Moment, in dem niemand mehr weiß,
warum etwas so ist.
