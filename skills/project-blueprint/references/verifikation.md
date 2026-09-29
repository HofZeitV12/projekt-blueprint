# Verifikation

**Jede Zeile wird wirklich ausgeführt.** Ein Häkchen ohne Befehl und Ausgabe ist keine
Prüfung. Das ist die einzige Regel, die hier zählt.

## Vor jeder Verifikation

```bash
# Nur EIN Entwicklungsprozess läuft
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3005 }

# Nichts Unfertiges liegt herum
git status
```

Mehrere Entwicklungsprozesse auf demselben Bauverzeichnis erzeugen Fehler, die nichts mit der
Ursache zu tun haben. Erst Ordnung, dann prüfen.

## Prüftabelle nach Phasen

### Phase 1–2 — Gerüst und Infrastruktur

| # | Prüfung | Vorgehen | Erwartet |
|---|---|---|---|
| 1 | Ignorierliste greift | eine Testdatei mit passendem Namen anlegen, `git status` | wird **nicht** angezeigt |
| 2 | Vorlage ohne echte Werte | `.env.example` durchsuchen nach Schlüssel-Präfixen | kein Treffer |
| 3 | Keine Werte in getrackten Dateien | Suche nach bekannten Präfixen im gesamten Repository | kein Treffer |
| 4 | Hauptzweig geschützt | Repo-Einstellungen lesen | Vorschlagspflicht aktiv, Pflichtprüfungen gesetzt |
| 5 | Automatisierungs-Geheimnisse | Repository-Geheimnisse auflisten | alle benötigten vorhanden, keine Werte einsehbar |
| 6 | Umgebungen vollständig | Hosting-Variablen je Umgebung vergleichen | gleiche Schlüssel in allen |
| 7 | Schnellstart läuft | `README.md` in frischer Kopie durchspielen | startet ohne Rückfragen |

**Suche nach Werten im Repository:**

```bash
git grep -nE '(sk_live_|sk_test_|whsec_|ghp_|github_pat_|eyJ[A-Za-z0-9_-]{20,}\.)' -- .
```

Ein Treffer ist ein **gefundener Fehler**. Vorgehen: melden, Rotation in der Quelle
veranlassen, dann entfernen. Das Entfernen allein macht den Wert nicht unbrauchbar — er bleibt
in der Versionsgeschichte.

### Phase 3 — Datenmodell

| # | Prüfung | Vorgehen | Erwartet |
|---|---|---|---|
| 8 | Migrationen eindeutig | `ls db/migrations/*.sql \| sed 's/.*\///' \| cut -d_ -f1 \| sort \| uniq -d` | leere Ausgabe |
| 9 | Wiederholbar | Migration ein zweites Mal anwenden | kein Fehler |
| 10 | Zugriffsregeln aktiv | Tabellenliste mit Regeln-Status | jede sensible Tabelle: aktiv |
| 11 | Öffentliche Rolle eingeschränkt | mit öffentlicher Rolle schreiben versuchen | **schlägt fehl** |
| 12 | Serverschlüssel nötig | sensible Tabelle ohne Serverschlüssel lesen | **schlägt fehl** |
| 13 | Funktionen geschützt | Funktion mit öffentlicher Rolle aufrufen | **schlägt fehl** |
| 14 | Funktionen nutzbar | dieselbe Funktion mit Serverrolle aufrufen | liefert Ergebnis |
| 15 | Indizes vorhanden | Index-Übersicht der Kerntabellen | alle geplanten da |
| 16 | Keine ungenutzten Indizes | Ausführungsplan der häufigsten Abfragen | Index wird genutzt |
| 17 | Typen aktuell | Typen neu generieren, `git diff` | keine Änderung (bzw. committet) |
| 18 | Prüfbedingungen greifen | ungültigen Zustandswert schreiben | **schlägt fehl** |

**Reihenfolge bei Fehlern:** Erst die Zugriffsregeln, dann die Indizes. Eine offene Tabelle
ist ein Datenproblem, ein fehlender Index ein Leistungsproblem.

### Phase 4 — Code-Schicht

| # | Prüfung | Vorgehen | Erwartet |
|---|---|---|---|
| 19 | Format | `npm run lint` | sauber |
| 20 | Typen | `npm run types` bzw. `npx tsc --noEmit` | sauber |
| 21 | Bau | `npm run build` | erfolgreich |
| 22 | Alles zusammen | `npm run check` | grün |
| 23 | Eine Wahrheit pro Wert | wiederkehrende Werte suchen (Preise, Grenzen) | genau eine Quelle |
| 24 | Fehler nach außen | Endpunkt mit Absicht brechen, Antwort ansehen | verständliche Meldung, **keine** Interna |
| 25 | Fehler im Protokoll | denselben Aufruf, Protokoll ansehen | vollständiger Fehler vorhanden |
| 26 | Zeitlimits gesetzt | Aufrufe externer Dienste prüfen | jeder mit Zeitlimit |
| 27 | Zustände in der Oberfläche | leeren, ladenden und Fehlerzustand herbeiführen | alle drei sichtbar |
| 28 | Tastaturbedienung | nur mit Tastatur durch den Hauptablauf | vollständig möglich |

### Phase 5 — Suche / RAG (nur falls vorhanden)

| # | Prüfung | Vorgehen | Erwartet |
|---|---|---|---|
| 29 | Index-Gesundheit | Gesundheitsfunktion aufrufen | Ähnlichkeitsindex **und** Volltextindex vorhanden |
| 30 | Keine leeren Vektoren | Gesundheitsfunktion / Zählung | 0 |
| 31 | Warteschlange läuft | Einleseskript ausführen | `verarbeitet > 0`, `fehler = 0` |
| 32 | Wiederholung wird erkannt | dasselbe noch einmal | „unverändert übersprungen", kein zweiter Aufruf |
| 33 | Suche liefert | Prüflauf ausführen | Recall@k über der Grenze |
| 34 | Weg sichtbar | Ausgabe des Prüflaufs | über Datenbank, nicht über Rückfallweg |
| 35 | Leere Suche | Frage außerhalb des Bestands | **keine** Treffer (gewollt) |
| 36 | Kein Leak | Frage mit Ausschlussbegriffen | kein Treffer mit geheimem Inhalt |
| 37 | Keine Erfindung | Antwort aus leerer Suche | sagt, dass nichts gefunden wurde |
| 38 | Zitate gültig | jede zitierte Kennung auflösen | existiert |
| 39 | Grenze erzwungen | Grenze künstlich hoch setzen | Prüflauf scheitert mit Fehlerausgabe |
| 40 | Läufe gespeichert | letzte Einträge ansehen | Kennzahl, Umgebung, Commit vorhanden |

### Phase 6–7 — Automatisierung und Auslieferung

| # | Prüfung | Vorgehen | Erwartet |
|---|---|---|---|
| 41 | Qualitätstor greift | Vorschlag mit absichtlichem Fehler | Lauf scheitert |
| 42 | Kein stummer Ausfall | Pflichtprüfung ansehen | kein Job mit „No jobs were run" |
| 43 | Migrationen im Tor | doppelte Kennung anlegen | Lauf scheitert |
| 44 | Deploy läuft | Push auf Hauptzweig | Deploy erfolgreich |
| 45 | Erreichbarkeit | Status der Produktivadresse | erwarteter Wert |
| 46 | Protokolle | Laufzeitprotokolle nach dem Deploy | keine neuen Fehler |
| 47 | Rückrollweg | letzten Deploy zurückrollen, dann wieder vor | funktioniert |
| 48 | Zeitplan aktiv | Liste der geplanten Läufe | Eintrag vorhanden und erfolgreich gelaufen |

### Phase 8 — Dokumentation

| # | Prüfung | Vorgehen | Erwartet |
|---|---|---|---|
| 49 | Tote Verweise | jeden Link in `docs/START.md` öffnen | alle vorhanden |
| 50 | Stände aktuell | Datum in jeder Datei gegen letzten Commit | passt |
| 51 | Einstieg ohne Hilfe | fremde Person startet anhand der Dateien | gelingt ohne Rückfragen |
| 52 | Entscheidungen vorhanden | nicht offensichtliche Strukturen prüfen | jeder hat einen Eintrag |
| 53 | Datensatzverzeichnis vollständig | jede Tabelle mit personenbezogenen Daten | hat eine Zeile |
| 54 | Runbook belastbar | Störfall-Tabelle | enthält echte Vorfälle |
| 55 | Changelog gepflegt | letzte Änderung | datiert und beschrieben |
| 56 | Widerspruchsfreiheit | Aussagen gegen Code | keine Widersprüche |

## Abnahmekriterien

```
Funktion
[ ] Hauptablauf von Hand vollständig durchgespielt
[ ] Leere, ladende und Fehlerzustände geprüft
[ ] Keine offene Zugriffsregel bei sensiblen Daten

Qualität
[ ] npm run check grün
[ ] Prüflauf der Suche über der Grenze (falls vorhanden)
[ ] Keine Werte in getrackten Dateien

Betrieb
[ ] Deploy erreichbar
[ ] Protokolle ohne neue Fehler
[ ] Rückrollweg einmal ausprobiert
[ ] Zeitplan gelaufen

Dokumentation
[ ] Entscheidungen geschrieben
[ ] Stand in docs/START.md aktualisiert
[ ] CHANGELOG ergänzt
[ ] Datensatzverzeichnis ergänzt, falls personenbezogene Daten betroffen
```

## Abschlussmeldung

Am Ende jeder Phase melden, in dieser Form:

```markdown
## Phase N – <Name>

**Angelegt:** … (mit echten Kennungen)
**Geprüft:** `<Befehl>` → <Auszug der echten Ausgabe>
**Offen:** … und warum.
**Dokumentation:** welche Dateien nachgezogen wurden.
```

**Kein „fertig" ohne ausgeführten Befehl.** Wenn eine Prüfung nicht möglich war, steht das
ausdrücklich dort — mit dem Grund.
