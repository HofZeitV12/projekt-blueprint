# Automatisierung, Qualitätstore und Deploy

## Was automatisiert geprüft wird

Der Zweck ist nicht Vollständigkeit, sondern **sichtbare Wahrheit**: Jede Prüfung muss ein
echtes Problem finden können.

| Prüfung | Findet | Pflichtprüfung? |
|---|---|---|
| Format/Lint | uneinheitlicher Stil, echte Fehler | ja |
| Typen | Widersprüche zwischen Modulen | ja |
| Bauen | Verdrahtung, fehlende Abhängigkeiten | ja |
| Migrationen | **doppelte Kennungen** (Reihenfolge unbestimmt) | ja |
| Tests | Verhalten gegen Erwartung | ja, sobald vorhanden |
| Güte der Suche | Rückschritt unter die Mindestgüte | nur mit Suchfunktion |
| Erreichbarkeit | Deploy wirklich erreichbar | nach dem Deploy |

## Qualitätstor bei jedem Vorschlag

Ein Arbeitsgang, feste Reihenfolge:

```yaml
# .github/workflows/ci.yml
name: Qualität

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  pruefen:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - name: Format
        run: npm run lint
      - name: Typen
        run: npm run types --if-present || npx tsc --noEmit
      - name: Tests
        run: npm test --if-present
      - name: Bauen
        run: npm run build
        env:
          # Platzhalter: Der Bau prüft die Verdrahtung, nicht die echte Funktion.
          DATABASE_URL: https://placeholder.example
          DATABASE_ANON_KEY: placeholder
          DATABASE_SERVICE_KEY: placeholder
```

Regeln:

- **`cancel-in-progress: true`** — alte Läufe abbrechen, sonst warten neue auf überholte.
- **Platzhalter für alle Werte im Bauschritt.** Ein Bau darf keine echten Geheimnisse brauchen.
  Fehlt einer, bricht der Bau ohne klare Ursache ab.
- **Feste Reihenfolge:** billige Prüfungen zuerst.
- **Zeitlimit** setzen, sonst hängt ein Lauf.

## Ein zweiter Arbeitsgang für Struktur und Betrieb

| Job | Prüft |
|---|---|
| `migrations` | **doppelte Kennungen**; Namensschema |
| `suche-guete` | Recall@k gegen die Mindestgüte; speichert den Lauf |
| `bauen` | nur auf dem Hauptzweig |
| `erreichbarkeit` | nach dem Deploy: Status der Produktivadresse |

```bash
# doppelte Migrationskennungen finden
ls db/migrations/*.sql | sed 's/.*\///' | cut -d_ -f1 | sort | uniq -d
```

**Kein Job darf über einen reinen Pfadfilter stumm ausfallen.** Eine Pflichtprüfung, die
„No jobs were run" meldet, blockiert jeden Vorschlag — und der Filter wird entfernt statt
verstanden.

## Deploy

**Standard: die Integration des Hosters.** Ein Push auf den Hauptzweig löst den Deploy aus.

Eine eigene Deploy-Aktion im Arbeitsgang nur, wenn die nötigen Geheimnisse **wirklich** als
Repository-Geheimnisse gesetzt sind. Sonst scheitert der Job in Sekunden — und bleibt
dauerhaft deaktiviert, was schlimmer ist als ihn wegzulassen.

**Nach dem Deploy:**

1. Warten, bis der Bau durch ist.
2. Erreichbarkeit prüfen (Status der Adresse).
3. Bei Fehlschlag: **Protokolle lesen**, nicht neu deployen.

Erlaubte Statuswerte hängen vom Projekt ab. Ein geschützter Zugang kann 401/403 liefern und
trotzdem „in Ordnung" sein — die Liste der akzeptierten Werte wird bewusst festgelegt, nicht
geraten.

## Vorschlagsfluss

1. **Vor der Arbeit:** `git status` prüfen. Nichts Unfertiges liegen lassen.
2. Zweig anlegen, klein und zweckgebunden.
3. Nach jedem abgeschlossenen Schritt committen — nicht einen Tag Arbeit in einen Commit.
4. **Vor dem Vorschlag lokal `npm run check`** laufen lassen. Muss dasselbe Ergebnis liefern
   wie die Automatisierung.
5. Vorschlag ausfüllen: Was, warum, wie geprüft, welche Dokumentation nachgezogen.
6. Nach der Annahme: Zweig weg, Hauptzweig aktualisieren.

### Vorlagentext für Vorschläge

```markdown
## Was

Kurzbeschreibung der Änderung.

## Warum

Auslöser und Zweck. Bei einer Architekturentscheidung: Link auf den Entscheidungseintrag.

## Wie geprüft

- [ ] `npm run check` lokal grün
- [ ] Betroffener Ablauf von Hand durchgespielt
- [ ] Bei Schemaänderung: Migration angewendet und Typen neu generiert

## Dokumentation

- [ ] Entscheidungseintrag geschrieben (falls zutreffend)
- [ ] Stand in der betroffenen Datei aktualisiert
- [ ] `CHANGELOG.md` ergänzt
```

## Lokale Automatisierung des Assistenten

**Niemals einen synchronen Netzwerkaufruf an ein Ereignis hängen, das bei jeder Änderung
feuert.** Ein Ereignis wie „Datei geändert" oder „Eingabe abgeschickt" liegt im Pfad des
Nutzers. Ein Aufruf kostet dort jedes Mal spürbar Zeit.

Stattdessen:

| Ereignis | Erlaubt |
|---|---|
| Sitzung beginnt | kurze Prüfung (Umgebung, laufende Hintergrundprozesse) |
| Sitzung endet | Zusammenfassung, gebündelt |
| Antwort fertig | Statistik, **losgelöst im Hintergrund** |

Der Netzwerkaufruf läuft in einem **abgetrennten Hintergrundprozess**, nie blockierend.

## Vielfache Hintergrundprozesse

Ein wiederkehrender, schwer zu findender Fehler:

> Mehrere Entwicklungsprozesse schreiben in dasselbe Bauverzeichnis. Beim Bauen werden
> Typen überschrieben, und es entstehen Fehlermeldungen, die nichts mit der Ursache zu tun
> haben — z. B. „Diese Route existiert nicht", obwohl sie existiert.

**Vor jeder Fehlersuche:**

```bash
# laufende Prozesse auf den üblichen Ports prüfen (Windows)
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3005 }
```

**Regel:** Nur **ein** Entwicklungsprozess gleichzeitig. **`build` niemals neben einem
laufenden Entwicklungsprozess.** Bei rätselhaften Typfehlern: alle stoppen, Bauverzeichnis
löschen, neu bauen.

## Gleichzeitige Arbeit am selben Projekt

Mehrere gleichzeitig laufende Sitzungen im selben Repository sind ein Datenverlustrisiko.
Zweigwechsel und Zurücksetzungen löschen **nicht gespeicherte** Änderungen — auch die des
Assistenten. Das ist mehrfach passiert.

Regeln:

1. Vor Konfigurationsarbeit: `git status` prüfen.
2. Änderungen **sofort** committen, nicht sammeln.
3. Nicht mehrere Sitzungen parallel im selben Repository arbeiten lassen.
4. Vor einem Zweigwechsel: ist alles gespeichert?

## Umgebungen

| Umgebung | Zweck | Daten |
|---|---|---|
| Lokal | Entwicklung | eigene Datenbank oder lokale Kopie |
| Vorschau | Prüfung je Vorschlag | eigene Datenbank, **nie** Produktivdaten |
| Produktion | echte Nutzer | echte Daten, Abzüge aktiv |

**Nie auf Produktivdaten testen.** Nicht mit echten Nutzerdaten, nicht mit echten Zahlungen.
Der Testmodus externer Dienste wird erst nach einem vollständigen Probelauf verlassen.

## Freigabe (Abnahme)

```
Lokal:      check grün
Vorschlag:  alle Pflichtprüfungen grün
Vorschau:   Ablauf von Hand durchgespielt
Deploy:     erreichbar, Protokolle ohne neue Fehler
Nachgang:   Dokumentation nachgezogen, CHANGELOG ergänzt, Entscheidungseintrag geschrieben
```
