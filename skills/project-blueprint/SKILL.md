---
name: project-blueprint
description: Use when setting up a new project or repository end-to-end, when the user asks for the standard project setup, Supabase schema, RAG pipeline, CI/CD gates, or professional documentation, or when an existing project needs its documentation, decisions and quality gates brought up to the same standard. Also use when a project has no docs index, no decision record, or no written state, and before any schema change that must be versioned.
---

# Projekt-Aufbau und Dokumentation

Ein Aufbau, der in jedem Projekt funktioniert: gefragt, gebaut, versioniert, geprüft und
**vollständig dokumentiert**. Inhaltlich neutral — Branche, Zweck und Domäne kommen aus dem
Projekt, nicht aus dieser Anleitung.

## Grundsätze

1. **Erst fragen, dann bauen.** Ohne die Antworten aus `references/intake.md` ist jede
   Struktur geraten.
2. **Jede Zustandsbehauptung braucht einen ausgeführten Befehl.** „Müsste laufen" ist keine
   Aussage über den Zustand.
3. **Dokumentation ist Teil des Ergebnisses, nicht Nacharbeit.** Wer baut, schreibt mit.
4. **Projektneutral.** Keine Projekt-IDs, Tokens, Repo-Namen oder Server aus anderen
   Projekten übernehmen. Jedes Projekt hat eigene Infrastruktur und eigene Secrets.
5. **Der Code gewinnt.** Widerspricht eine Notiz oder Regel dem Code, gilt der Code — und
   die Notiz wird im selben Vorgang korrigiert.

## Vor dem ersten Befehl

Stelle die Intake-Fragen aus `references/intake.md` und warte auf die Antworten. Frage
nichts, was in den vorhandenen Dateien bereits steht. Halte das Ergebnis schriftlich fest
(Zielort: `docs/PROJEKT.md`, Vorlage in `references/dokumentation.md`).

## Ablauf

Führe die Phasen der Reihe nach. Jede Phase endet mit einer kurzen Meldung: was entstanden
ist, womit es geprüft wurde, was offen blieb.

```
Fortschritt:
- [ ] Phase 1  Gerüst          Ordner, Tools, Env-Disziplin
- [ ] Phase 2  Infrastruktur   Datenbank, Repo, Hosting, Secrets
- [ ] Phase 3  Datenmodell     Migrationen, Indizes, Zugriffsregeln
- [ ] Phase 4  Code-Schicht    Module, Konventionen, Fehlerbehandlung
- [ ] Phase 5  Suche/RAG       nur wenn inhaltliche Suche gebraucht wird
- [ ] Phase 6  CI/CD           Qualitätstore, Deploy, Health-Check
- [ ] Phase 7  Verifikation    jede Prüfung real ausgeführt
- [ ] Phase 8  Dokumentation   Index, Entscheidungen, Stand, Runbook
```

**Phase 1 – Gerüst.** Struktur, `tsconfig` eng fassen, npm-Scripts, Env-Trennung.
Siehe `references/geruest.md`.

**Phase 2 – Infrastruktur.** Datenbankprojekt, Repository mit geschütztem Hauptzweig,
Hosting, Secrets je Umgebung. Erst lesen, dann anlegen. Siehe `references/geruest.md`.

**Phase 3 – Datenmodell.** Ausschließlich versionierte Migrationen im Repo. Namen einmal
festlegen und dann konsequent schreiben. Zugriffsregeln ab Tag eins. Siehe
`references/datenmodell.md`.

**Phase 4 – Code-Schicht.** Ein Modul pro Verantwortung, eine Wahrheit pro Wert,
einheitliche Fehlerbehandlung. Siehe `references/code-schicht.md`.

**Phase 5 – Suche / RAG.** Nur wenn das Projekt inhaltliche Volltext- oder Ähnlichkeitssuche
braucht. Siehe `references/rag-pipeline.md`.

**Phase 6 – CI/CD.** Qualitätstore bei jedem Vorschlag, Deploy über die Hosting-Integration,
Health-Check danach. Siehe `references/ci-cd.md`.

**Phase 7 – Verifikation.** Jede Zeile der Prüftabelle in `references/verifikation.md`
wirklich ausführen. Erst danach „fertig" sagen. Siehe auch `references/regeln-und-fallen.md`.

**Phase 8 – Dokumentation.** Das Kernstück. Siehe nächster Abschnitt.

## Dokumentationssystem

Das ist der Teil, der ein Projekt nach drei Monaten noch benutzbar macht. Vier Ebenen, jede
mit einer klaren Leserschaft:

| Ebene | Datei(en) | Leser | Aktualisiert |
|---|---|---|---|
| **Einstieg** | `docs/START.md` | Mensch oder Assistent, der neu einsteigt | bei Richtungswechsel |
| **Projektbild** | `docs/PROJEKT.md` | alle | bei Zweck-/Umfangsänderung |
| **Entscheidungen** | `docs/entscheidungen/NNNN-*.md` | wer später „warum?" fragt | **vor** der Umsetzung |
| **Betrieb** | `docs/RUNBOOK.md` | wer nachts etwas reparieren muss | bei jedem Vorfall |

Dazu im Wurzelverzeichnis: `README.md` (was ist das, wie starte ich es), `CHANGELOG.md`
(was hat sich geändert), `AGENTS.md` (Konventionen für Assistenten).

### Die vier Regeln, die den Unterschied machen

1. **Entscheidungen werden vorher geschrieben, nicht hinterher.** Ein Eintrag mit Datum,
   Auslöser, verworfenen Alternativen und Gründen. Wer später die Alternative vorschlägt,
   liest warum sie verworfen wurde.
2. **Jede Datei trägt einen Stand.** Ein Datum oder eine Version oben. Eine Datei ohne Stand
   ist eine Behauptung ohne Haltbarkeit.
3. **Ein Index verlinkt alles.** `docs/START.md` ist die einzige Tür. Wer sie öffnet, findet
   innerhalb von zwei Klicks jede andere Datei.
4. **Veraltetes wird korrigiert oder gelöscht, nicht ergänzt.** Ein Abschnitt „das gilt nicht
   mehr" ist eine Falle. Alte Fassung ersetzen.

Vorlagen für alle Dateien: `references/dokumentation.md`.

### Dokumentation prüfen

Ein Projekt ist nicht dokumentiert, weil Dateien existieren, sondern weil sie stimmen:

- Verweist jede Datei im Index auf etwas, das noch existiert?
- Trägt jede Datei einen Stand, der zum letzten Commit passt?
- Hat jede nicht offensichtliche Entscheidung einen Eintrag?
- Steht im Runbook, was bei einem Ausfall konkret zu tun ist — mit echten Befehlen?
- Widerspricht eine Aussage dem Code? Dann korrigieren, nicht relativieren.

## Wenn ein Projekt schon existiert

Nicht neu bauen. In dieser Reihenfolge vorgehen:

1. Code lesen, nicht annehmen. Struktur, Skripte, Datenbank, Umgebungen erfassen.
2. Lücken gegen die Phasen oben notieren — als Liste, nicht als Umbau.
3. `docs/START.md` und `docs/PROJEKT.md` schreiben, bevor irgendetwas geändert wird. Das
   schafft die Grundlage, auf der Änderungen begründbar sind.
4. Erst dann die größte echte Lücke schließen — meistens fehlende Versionierung,
   fehlende Zugriffsregeln oder fehlende Qualitätstore.
5. Jede Änderung dokumentieren, im selben Vorgang.

## Referenzdateien

- `references/intake.md` — Fragenkatalog vor dem ersten Befehl
- `references/geruest.md` — Struktur, Skripte, Umgebungen, Secrets
- `references/datenmodell.md` — Migrationen, Indizes, Zugriffsregeln, Funktionen
- `references/code-schicht.md` — Module, Konventionen, Fehlerbehandlung, externe Dienste
- `references/rag-pipeline.md` — Chunking, Vektoren, Hybrid-Suche, Qualitätsmessung
- `references/ci-cd.md` — Qualitätstore, Deploy, Hooks, Vorschlagsfluss
- `references/verifikation.md` — Prüftabelle je Phase, Abnahmekriterien
- `references/dokumentation.md` — Vorlagen für alle Dokumente und Entscheidungseinträge
- `references/regeln-und-fallen.md` — harte Regeln und teuer gelernte Fehler
