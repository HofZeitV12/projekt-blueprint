# Projekt-Bootstrap – Arbeitsauftrag für den Agenten

**Lies diese Datei vollständig, dann beginne mit Schritt 1. Arbeite die Schritte der Reihe nach
ab. Überspringe keinen Schritt und triff keine Annahmen, die du erfragen kannst.**

---

## Was du gerade geladen hast

Ein erprobtes Vorgehen für **Projektaufbau und Dokumentation**. Es ist inhaltlich leer: Branche,
Zweck und Domäne kommen aus dem Projekt, in dem du gerade arbeitest.

Du hast zwei Aufgaben, und sie laufen **gleichzeitig**:

1. **Bauen** — Struktur, Datenbank, Code, Automatisierung.
2. **Dokumentieren** — im selben Vorgang, nicht danach.

Ein Ergebnis ohne Dokumentation gilt als **nicht fertig**.

---

## Harte Regeln — gelten ab jetzt für jeden Schritt

1. **Erst fragen, dann bauen.** Ohne die Antworten aus Schritt 1 ist jede Struktur geraten.
2. **Jede Aussage über den Zustand braucht einen ausgeführten Befehl.** „Müsste laufen" ist
   keine Aussage über den Zustand. Zeige den Befehl und seine Ausgabe.
3. **Erst lesen, dann ändern.** Öffne die Datei, bevor du sie änderst. Nimm niemals aus dem
   Gedächtnis an, wie etwas aussieht.
4. **Übernimm nichts aus anderen Projekten.** Keine Projektkennungen, keine Zugangsdaten, keine
   Servernamen, keine Repository-Namen. Jedes Projekt hat eigene Infrastruktur.
5. **Kleinste sinnvolle Änderung.** Kein Umbau nebenbei.
6. **Keine echten Werte in getrackten Dateien.** Nicht in Vorlagen, nicht in Skripten, nicht in
   Kommentaren. Vorlagen enthalten Platzhalter mit Bezugsquelle.
7. **Der Code gewinnt.** Widerspricht eine Aussage dem Code, korrigiere die Aussage.
8. **Dokumentation im selben Vorgang.** Nach jedem Feature sofort nachziehen, nicht sammeln.

---

## Schritt 1 — Fragen stellen und auf Antworten warten

Stelle die folgenden Fragen. Frage **nichts**, was in den Dateien des Projekts bereits steht —
lies zuerst das Repository, dann frage nur die Lücken.

| # | Frage | Wofür |
|---|---|---|
| 1 | Was ist das Projekt, in einem Satz? Wer nutzt es? | `README.md`, Projektbild |
| 2 | Was ist **ausdrücklich nicht** im Umfang? | Verhindert Wildwuchs |
| 3 | Sprache der Oberfläche? Sprache der Dokumentation? | Volltextsuche, Doku, Bezeichner |
| 4 | Wo läuft es — Hosting, eigener Server, lokal? | Umgebungsvariablen, Deploy-Pfad |
| 5 | Datenbank: neu anlegen oder bestehendes anbinden? | Projektkennung überall |
| 6 | Repository: Name und Eigentümer? | Migrationen, Automatisierung |
| 7 | Zahlungen, Abos, Rechnungen nötig? | Webhook-Fluss, Testmodus |
| 8 | Welche Daten sind personenbezogen oder geheim? | Zugriffsregeln, Ausschlusslisten, Löschkonzept |
| 9 | Welche Tabellen/Daten sind die fachlichen Kerntabellen? | Indizes, Suchschwerpunkt |
| 10 | Müssen Inhalte durchsuchbar sein? | Entscheidet, ob Phase 5 läuft |
| 11 | Gibt es Hintergrundarbeit — geplante Läufe, Warteschlangen? | Struktur, Laufzeitgrenzen |
| 12 | Woran merkt man, dass es **fertig** ist? | Abnahmekriterien statt Bauchgefühl |

**Die Fragen 5, 8, 10 und 12 müssen beantwortet sein** — sie erzwingen Struktur.

Nicht beantwortbare Punkte: als offene Frage mit Datum festhalten, nicht raten und nicht
blockieren.

**Warte auf die Antworten, bevor du Schritt 2 beginnst.**

---

## Schritt 2 — Sagen, was du vorhast

Fasse in höchstens zehn Zeilen zusammen:

- welches Ziel du verstanden hast,
- welche Phasen für **dieses** Projekt laufen und welche entfallen und warum,
- was du zuerst anlegst.

Erst danach beginnen.

---

## Schritt 3 — Die Phasen abarbeiten

```
- [ ] Phase 1  Gerüst          Struktur, Skripte, Umgebungen, Geheimnisse
- [ ] Phase 2  Infrastruktur   Datenbank, Repository, Hosting
- [ ] Phase 3  Datenmodell     Migrationen, Indizes, Zugriffsregeln
- [ ] Phase 4  Code-Schicht    Module, Konventionen, Fehlerbehandlung
- [ ] Phase 5  Suche/RAG       nur wenn Frage 10 = ja
- [ ] Phase 6  Automatisierung Qualitätstore, Deploy
- [ ] Phase 7  Verifikation    jede Prüfung real ausgeführt
- [ ] Phase 8  Dokumentation   Index, Entscheidungen, Stand, Runbook
```

### Phase 1 — Gerüst

- Struktur nach **Verantwortung** ordnen, nicht nach Dateityp: Anwendung, Fachlogik,
  Oberfläche, **ein** Migrationsordner, Betriebsskripte, Dokumentation, Automatisierung.
- Wiederkehrende Befehle als Skripte anlegen. Ein `check`, der Format, Typen, Tests und Bau
  zusammenfasst — lokal muss er **dasselbe** ergeben wie die Automatisierung.
- Typkonfiguration **eng** fassen (nur die echten Quellordner). Ein breites Muster zieht
  Unterprojekte und Bau-Artefakte in jede Prüfung.
- **Ignorierliste zuerst**, bevor der erste Commit entsteht: `.env*.local`, `.env`, `*.pem`,
  `*.key`, Zugangsdateien, Datenbankabzüge.
- Umgebungen trennen:
  | Ebene | Datei | Im Repo? | Inhalt |
  |---|---|---|---|
  | Maschinell | `.env.local` | nein | echte Werte |
  | Vorlage | `.env.example` | ja | **nur Platzhalter** + Bezugsquelle je Wert |
  | Laufzeit | Hosting-Variablen | — | je Umgebung vollständig |
- Werte, die in die Oberfläche dürfen, kennzeichnen (Präfix). **Alles andere ist serverseitig.**

### Phase 2 — Infrastruktur

Datenbankprojekt ermitteln oder anlegen → vorhandene Struktur **lesen** (Tabellen, Migrationen,
Erweiterungen) → Sicherheits- und Leistungshinweise als Ausgangsstand abrufen.

Repository: privat, Hauptzweig `main`, **Schutz** (Vorschlagspflicht, Pflichtprüfungen, keine
erzwungenen Überschreibungen), Geheimnisse als Repository-Geheimnisse, Vorlage für Vorschläge.

Hosting: mit dem Repository verbinden (= Deploy-Pfad), Variablen je Umgebung vollständig setzen.

### Phase 3 — Datenmodell

**Alles im Repository, nichts nur im Dashboard.**

- Eine Datei pro Änderung, `JJJJMMTTHHMMSS_kurz_slug.sql`, **ein** Ordner, eindeutige
  Zeitstempel, **rein additiv**, wiederholbar geschrieben (`if not exists`, `or replace`).
- Namen einmal festlegen, dann überall gleich — Datenbank, Code, Dokumentation,
  Fehlermeldungen. Ein historischer Tippfehler bleibt, wenn er überall steckt, und wird
  **ausdrücklich dokumentiert**, damit ihn niemand „korrigiert".
- Zustandsmodelle mit erlaubtem **Wertebereich in der Datenbank**, Zeitstempel bei jedem
  Wechsel, Ausgangszustand prüfen beim Weiterschreiben.
- Indizes: Fremdschlüssel immer, häufige Filter, Sortierrichtung, Werte-Listen (GIN), Volltext
  mit passender Sprachkonfiguration, Ähnlichkeit (Vektor). **Teilweise eindeutige Indizes** für
  „nur eine Sache gleichzeitig".
- **Zugriffsregeln ab Tag eins**: Regeln aktivieren, Standard ist verboten, öffentliche Rolle
  bekommt nur was nötig, Serverrolle bleibt serverseitig.
- **Funktionen mit erhöhten Rechten**: Rechte von public/anon/authenticated entziehen, nur der
  Serverrolle geben, Suchpfad fest setzen. Danach **prüfen, dass der öffentliche Aufruf
  fehlschlägt** — ein gelungener Aufruf ist ein gefundener Fehler.
- Wiederkehrende Aufgaben (Aufräumen, Zurücksetzen hängender Zustände) als Funktion in der
  Datenbank. Reservierung mit `for update skip locked`, Versuchszähler, Zurücksetzen nach N
  Minuten.
- **Erst begrenzen, dann Schwellen anwenden** — sonst nutzt der Planer den Index nicht und
  liest die ganze Tabelle.
- Anschließend: Hinweise des Anbieters abarbeiten, Typen generieren und committen.

### Phase 4 — Code-Schicht

- Endpunkte prüfen Eingaben und formen Antworten — **keine** Fachlogik in der Route.
- **Eine Wahrheit pro Wert**: Preise, Grenzen, Aufzählungen, Modellnamen an *einer* Stelle.
  Keine Kopie in der Dokumentation — dort wird **verwiesen**.
- Einheitliche Fehlerbehandlung: verständliche Meldung nach außen, vollständiger Fehler ins
  Protokoll, Eingabefehler von Systemfehlern getrennt, **nichts verschlucken**.
- **Ein Modul pro externem Dienst**: Zugangsdaten, **Zeitlimit**, Wiederholung mit Grenze,
  Zählung der Aufrufe, Bereitschaftsprüfung.
- Hintergrundarbeit: bei nur einem erlaubten Zeitplan orchestriert **ein** Einstiegspunkt
  mehrere Teilaufgaben — billige und kritische zuerst, **teure zuletzt** (darf ausfallen).
  Jeder Teilauftrag mit eigenem Zeitlimit und Kurzbefund.
- Oberfläche: **alle Zustände** (leer, lädt, Fehler, Erfolg), keine Zugangsdaten,
  Barrierefreiheit ab Tag eins (Tastatur, sichtbarer Fokus, Kontrast, beschriftete Eingaben).

### Phase 5 — Suche / RAG (nur wenn Frage 10 = ja)

- Eine Suchtabelle für alle Inhalte: `source_table`, `source_id` **als Text**, `chunk_text`,
  Vektor, `metadata`. Eindeutiger Index auf `(source_table, source_id)`.
- Mehrere Ausschnitte: `source_id = '<id>#<n>'`, `metadata.parent_id = '<id>'`. Zitiert wird die
  Kennung **ohne** Zusatz.
- Prüfsumme des Inhalts in `metadata` speichern → erneutes Einlesen wird übersprungen.
  Modellname und Dimension mitführen.
- **Auslöser in der Datenbank** reihen bei Änderung ein; **Geheimes wird vorher ausgefiltert**.
- **Warteschlange** mit Versuchszähler, Reservierung mit Zeitstempel, Zurücksetzen.
- Indizes: Ähnlichkeit **und** Volltext (Sprachkonfiguration passend zu den Inhalten).
- Suchfunktion serverseitig mit Rechteentzug: **erst nächste Nachbarn begrenzen, dann
  Schwelle**. Hybrid über **Rangfolge** verschmelzen (`1/(60+rang)`), nicht über Abstände.
- **Ausschluss von Geheimem an drei Stellen**: Einreihen, Verarbeiten, Ersterfassung.
- **Qualität messen**: fester Fragensatz mit Erwartung, verbotenen Begriffen, gewollt leeren
  Fragen, erwartetem Zitat. Recall@k und MRR messen, Grenze **erzwingen** (Prüflauf scheitert
  darunter), jeden Lauf mit Umgebung und Commit speichern.
- **Bei leerer Suche nicht antworten** — sagen, dass nichts gefunden wurde. Das ist die
  wichtigste Regel gegen erfundene Inhalte.
- Kontext mit **Token-Budget** aus der Konfiguration; Relevanz und Priorität sichtbar machen.

### Phase 6 — Automatisierung

Ein Qualitätstor bei jedem Vorschlag, feste Reihenfolge: Format → Typen → Tests → Bau.
**Platzhalter-Werte im Bauschritt** — ein Bau darf keine echten Geheimnisse brauchen.
Alte Läufe abbrechen (`cancel-in-progress`), Zeitlimit setzen.

Zweiter Lauf für Struktur: **doppelte Migrationskennungen**, Güte der Suche, Bau nur auf dem
Hauptzweig, Erreichbarkeit nach dem Deploy.

**Kein Job darf über einen Pfadfilter stumm ausfallen** — eine Pflichtprüfung mit „No jobs were
run" blockiert jeden Vorschlag. Ursache beheben, nicht den Filter entfernen.

Deploy über die Integration des Hosters. Eine eigene Deploy-Aktion nur mit wirklich gesetzten
Geheimnissen, sonst weglassen. **Nach dem Deploy Protokolle lesen**, bei Fehler **zurückrollen**.

Assistenten-Automatisierung: **nie** einen synchronen Netzwerkaufruf an ein Ereignis hängen, das
bei jeder Änderung feuert. Gebündelt bei Sitzungsbeginn/-ende, losgelöst im Hintergrund.

### Phase 7 — Verifikation

Führe die Prüfungen **wirklich** aus. Keine Häkchen ohne Befehl und Ausgabe.

| Bereich | Prüfung | Erwartet |
|---|---|---|
| Geheimnisse | Repository nach Schlüssel-Präfixen durchsuchen | kein Treffer |
| Geheimnisse | Ignorierliste greift (Testdatei anlegen) | wird nicht angezeigt |
| Schema | doppelte Migrationskennungen | leere Ausgabe |
| Schema | Migration ein zweites Mal anwenden | kein Fehler |
| Zugriff | mit öffentlicher Rolle schreiben | **schlägt fehl** |
| Zugriff | Funktion mit öffentlicher Rolle aufrufen | **schlägt fehl** |
| Zugriff | sensible Tabelle ohne Serverschlüssel lesen | **schlägt fehl** |
| Code | `npm run check` | grün |
| Code | Fehlerantwort eines absichtlich kaputten Endpunkts | keine Interna nach außen |
| Suche | Prüflauf | über der Mindestgüte |
| Suche | Frage außerhalb des Bestands | keine Treffer, keine Erfindung |
| Betrieb | Erreichbarkeit nach Deploy | erwarteter Status |
| Betrieb | Rückrollweg | funktioniert |
| Doku | jeder Link in `docs/START.md` | alle vorhanden |
| Doku | fremde Person startet anhand der Dateien | gelingt ohne Rückfragen |

**Vor jeder Fehlersuche:** Prüfen, wie viele Entwicklungsprozesse laufen. Mehrere auf demselben
Bauverzeichnis überschreiben sich gegenseitig und erzeugen Fehler ohne Bezug zur Ursache. `build`
nie neben einem laufenden Prozess — sonst alle stoppen, Bauverzeichnis löschen, neu bauen.

### Phase 8 — Dokumentation

Vier Ebenen, jede mit **einer** Leserschaft und **einer** Frage:

| Ebene | Datei | Beantwortet | Aktualisiert |
|---|---|---|---|
| Einstieg | `docs/START.md` | „Wo fange ich an?" | bei Richtungswechsel |
| Projektbild | `docs/PROJEKT.md` | „Was ist das, und was nicht?" | bei Zweckänderung |
| Entscheidungen | `docs/entscheidungen/NNNN-*.md` | „Warum ist das so?" | **vor** der Umsetzung |
| Betrieb | `docs/RUNBOOK.md` | „Was tue ich jetzt?" | bei jedem Vorfall |

Dazu im Wurzelverzeichnis: `README.md`, `CHANGELOG.md`, `AGENTS.md`.

**Die fünf Regeln:**

1. **Entscheidungen vor der Umsetzung** — mit Auslöser, verworfenen Alternativen und Folgen.
   Nachträglich geschriebene Einträge sind Rechtfertigung, keine Dokumentation.
2. **Jede Datei trägt einen Stand** (Datum oben).
3. **`docs/START.md` ist die einzige Tür** — alles in zwei Klicks, keine toten Verweise.
4. **Veraltetes korrigieren oder löschen, nie ergänzen.**
5. **Der Code gewinnt.**

Weitere Dateien je Bedarf:

| Datei | Wann |
|---|---|
| `docs/RUNBOOK.md` | immer — mit **echten Befehlen** und Tabelle der Störfälle |
| Datensatzverzeichnis | sobald personenbezogene Daten vorkommen (Zweck, Grundlage, **konkrete** Aufbewahrung, Empfänger) |
| Zugangsregister | immer — nur **Fundorte**, niemals Werte |
| Glossar | nur Begriffe mit **projektspezifischer** Bedeutung |

**Der Test, der zählt:** Eine fremde Person kann anhand von `README.md` und `docs/START.md` ohne
Rückfragen starten, prüfen und den nächsten Schritt erkennen.

---

## Nach jedem Feature — im selben Vorgang

| Änderung | Nachziehen |
|---|---|
| Neues Feature | `START.md` → Stand; `CHANGELOG.md` → Hinzugefügt |
| Schemaänderung | `CHANGELOG.md`; Datensatzverzeichnis bei personenbezogenen Daten |
| Umbenennung | alle Verweise, Glossar |
| Neue externe Abhängigkeit | Zugangsregister, Datensatzverzeichnis |
| Architekturentscheidung | **Entscheidungseintrag** |
| Vorfall | `RUNBOOK.md` → Störfälle |
| Neuer Befehl | `README.md`, `AGENTS.md` |

**Nicht** sammeln und später nachtragen. Später ist der Moment, in dem niemand mehr weiß, warum
etwas so ist.

---

## Abschlussmeldung je Phase

```markdown
## Phase N – <Name>

**Angelegt:** … (mit echten Kennungen)
**Geprüft:** `<Befehl>` → <Auszug der echten Ausgabe>
**Offen:** … und warum.
**Dokumentation:** welche Dateien nachgezogen wurden.
```

**Kein „fertig" ohne ausgeführten Befehl.** War eine Prüfung nicht möglich, steht das dort —
mit Grund.

---

## Wenn das Projekt schon existiert

Nicht neu bauen. In dieser Reihenfolge:

1. Code und Struktur **lesen**, nicht annehmen. Struktur, Skripte, Datenbank, Umgebungen
   erfassen.
2. Lücken gegen die Phasen notieren — als Liste, nicht als Umbau.
3. **Zuerst** `docs/START.md` und `docs/PROJEKT.md` schreiben. Das schafft die Grundlage, auf
   der Änderungen begründbar sind.
4. Erst dann die größte echte Lücke schließen — meistens fehlende Versionierung, fehlende
   Zugriffsregeln oder fehlende Qualitätstore.
5. Jede Änderung im selben Vorgang dokumentieren.

---

## Vertiefung

Diese Datei ist der Auftrag. Für die Begründungen und alle Vorlagen liegen im selben Repository
unter `skills/project-blueprint/`:

| Datei | Inhalt |
|---|---|
| `SKILL.md` | Einstieg und Übersicht |
| `references/intake.md` | Fragenkatalog, Ergebnisform |
| `references/geruest.md` | Struktur, Skripte, Umgebungen, Geheimnisse |
| `references/datenmodell.md` | Migrationen, Indizes, Zugriffsregeln, Funktionen |
| `references/code-schicht.md` | Module, Konventionen, Fehlerbehandlung |
| `references/rag-pipeline.md` | Chunking, Vektoren, Hybridsuche, Qualitätsmessung |
| `references/ci-cd.md` | Qualitätstore, Deploy, Vorschlagsfluss, Umgebungen |
| `references/verifikation.md` | vollständige Prüftabelle, Abnahmekriterien |
| `references/dokumentation.md` | Vorlagen für **alle** Dokumente |
| `references/regeln-und-fallen.md` | harte Regeln und teuer gelernte Fehler |

Lies die Referenzdatei, wenn du an der Stelle bist, die sie vertieft — nicht alle auf einmal.
