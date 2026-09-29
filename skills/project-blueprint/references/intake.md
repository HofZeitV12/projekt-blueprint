# Intake – Fragen vor dem ersten Befehl

Stelle diese Fragen **bevor** irgendetwas angelegt wird, und warte auf die Antworten. Frage
nichts, was in den Dateien des Projekts bereits steht. Halte das Ergebnis in `docs/PROJEKT.md`
fest — es ist die Grundlage jeder späteren Entscheidung.

## Muss beantwortet sein

| # | Frage | Wofür die Antwort gebraucht wird |
|---|---|---|
| 1 | Was ist das Projekt, in einem Satz? Wer nutzt es? | `README.md`, `docs/PROJEKT.md`, Namensgebung |
| 2 | Was ist **außerhalb** des Umfangs? | Verhindert Wildwuchs; gehört schriftlich ins Projektbild |
| 3 | Neu aufsetzen oder in etwas Bestehendes hinein? | Bestimmt, ob Phase 1–8 voll laufen oder nur Lücken gefüllt werden |
| 4 | Sprache der Oberfläche? Sprache der Dokumentation? | Doku-Sprache, Volltext-Suche (Sprachkonfiguration), Bezeichner |
| 5 | Wo läuft es? (Hosting, eigener Server, lokal) | Env-Variablen, Deploy-Pfad, Health-Check |
| 6 | Neues Datenbankprojekt oder bestehendes anbinden? | Projektkennung überall, sonst Verwechslungsgefahr |
| 7 | Wie heißt das Repository? Wer ist Eigentümer? | Migrationen, CI, Vorschlagsfluss |
| 8 | Gibt es Zahlungen, Abos, Rechnungen? | Zusätzliche Pflichten, Webhook-Fluss, Testmodus |
| 9 | Welche Daten sind personenbezogen oder geheim? | Zugriffsregeln, Ausschlusslisten, Löschkonzept |
| 10 | Welche Tabellen/Daten sind die **fachlichen Kerntabellen**? | Indizes, Suche, Dokumentationsschwerpunkt |

## Sollte beantwortet sein

| # | Frage | Warum |
|---|---|---|
| 11 | Muss man Inhalte durchsuchen können? | Entscheidet, ob Phase 5 (RAG) überhaupt läuft |
| 12 | Gibt es Hintergrundarbeit (geplante Läufe, Warteschlangen)? | Ordnerstruktur, Laufzeitgrenzen |
| 13 | Wer arbeitet außer dir noch daran? | Detailtiefe der Dokumentation, Zweigstrategie |
| 14 | Woran merkt man, dass es **fertig** ist? | Abnahmekriterien statt Bauchgefühl |
| 15 | Was ist der nächste Meilenstein nach dem Start? | Priorität in der ersten Aufgabenliste |
| 16 | Welche Werkzeuge sind schon vorhanden und sollen bleiben? | Keine unnötigen Umbauten |

## Umgang mit „weiß ich noch nicht"

Nicht raten und nicht blockieren. Stattdessen:

- Als offene Frage in `docs/PROJEKT.md` unter **Offene Fragen** eintragen, mit Datum.
- Wenn die Entscheidung später fallen muss, als Entscheidungseintrag
  `docs/entscheidungen/NNNN-*.md` mit Status **offen** anlegen.
- Eine offene Frage darf den Start nicht aufhalten, solange sie keine Struktur erzwingt.
  Ob durchsucht werden muss (Frage 11) und ob es Zahlungen gibt (Frage 8) erzwingen Struktur —
  die müssen beantwortet sein.

## Ergebnisform

Halte das Intake fest, nicht nur im Kopf:

```markdown
## Projektbild

**Zweck:** …
**Nutzer:** …
**Nicht im Umfang:** …
**Sprachen:** Oberfläche … / Dokumentation …
**Laufzeitort:** …
**Datenbank:** neu / bestehend — Kennung …
**Repository:** …
**Zahlungen:** ja / nein — …
**Personenbezogene oder geheime Daten:** …
**Kerntabellen:** …
**Durchsuchbare Inhalte:** ja / nein — …
**Hintergrundarbeit:** …
**Mitarbeitende:** …
**Fertig, wenn:** …
```

Diese Tabelle ist der erste Inhalt von `docs/PROJEKT.md` und wird bei jeder Änderung an Zweck
oder Umfang nachgezogen — nicht neu geschrieben.
