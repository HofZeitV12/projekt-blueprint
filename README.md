# Projekt-Blueprint

**Aufbau und Dokumentation für jedes Projekt.** Branche, Zweck und Domäne kommen aus dem
Projekt — dieser Blueprint liefert nur das Vorgehen.

Ein erprobtes Verfahren, um ein Projekt von null aufzubauen: Struktur, Datenbank, Code,
Automatisierung, Qualitätstore — und **vollständige Dokumentation im selben Vorgang**.

---

## Ein Satz reicht

In ein **neues, leeres** Projekt — Cursor, Claude Code, ein beliebiger Agent:

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/BOOTSTRAP.md
und arbeite es vollständig ab.
```

Der Agent lädt die Anweisung, stellt erst die nötigen Fragen und baut dann. Fertige Vorlagen
sind weiter unten verlinkt und werden bei Bedarf einzeln nachgeladen.

**Ohne Netzwerkzugriff** (Agent kann keine URL öffnen): `BOOTSTRAP.md` und den Ordner
`skills/` in das Projekt kopieren, dann:

```
Lies BOOTSTRAP.md im Projektstamm und arbeite es vollständig ab.
```

Fertige Textbausteine für beide Wege: [COPY-PASTE.md](COPY-PASTE.md)

---

## Was passiert

Der Agent arbeitet acht Phasen ab. Jede endet mit einer Meldung: was angelegt, womit geprüft,
was offen.

```
Phase 1  Gerüst          Struktur, Skripte, Umgebungen, Geheimnisse
Phase 2  Infrastruktur   Datenbank, Repository, Hosting
Phase 3  Datenmodell     Migrationen, Indizes, Zugriffsregeln
Phase 4  Code-Schicht    Module, Konventionen, Fehlerbehandlung
Phase 5  Suche/RAG       nur wenn Inhalte durchsuchbar sein müssen
Phase 6  Automatisierung Qualitätstore, Deploy
Phase 7  Verifikation    jede Prüfung real ausgeführt
Phase 8  Dokumentation   Index, Entscheidungen, Stand, Runbook
```

Vorher stellt er zwölf Fragen — Zweck, Umfang, Sprachen, Umgebung, Datenbank, Geheimnisse.
Ohne diese Antworten wäre jede Struktur geraten. Er wartet auf deine Antworten, bevor er baut.

---

## Die zwei Aufgaben laufen zusammen

Bauen und Dokumentieren sind **ein** Vorgang. Ein Ergebnis ohne Dokumentation gilt als nicht
fertig.

| Ebene | Datei | Beantwortet |
|---|---|---|
| Einstieg | `docs/START.md` | „Wo fange ich an?" |
| Projektbild | `docs/PROJEKT.md` | „Was ist das, und was nicht?" |
| Entscheidungen | `docs/entscheidungen/NNNN-*.md` | „Warum ist das so?" |
| Betrieb | `docs/RUNBOOK.md` | „Was tue ich jetzt?" |

Dazu `README.md`, `CHANGELOG.md`, `AGENTS.md` und — sobald personenbezogene Daten vorkommen —
ein Datensatzverzeichnis.

**Der Test, der zählt:** Eine fremde Person kann anhand von `README.md` und `docs/START.md`
ohne Rückfragen starten, prüfen und den nächsten Schritt erkennen.

---

## Was der Blueprint nicht tut

- **Er kennt deine Branche nicht.** Fachliche Entscheidungen triffst du.
- **Er trifft Annahmen nicht selbstständig.** Was unklar ist, wird gefragt — nicht geraten.
- **Er übernimmt nichts aus anderen Projekten.** Keine Kennungen, Zugangsdaten, Servernamen,
  Repository-Namen. Jedes Projekt hat eigene Infrastruktur und eigene Geheimnisse.

---

## Dateien

| Datei | Zweck |
|---|---|
| `BOOTSTRAP.md` | **Der Auftrag.** Diese Datei lädt und abarbeitet ein Agent |
| `COPY-PASTE.md` | Fertige Textbausteine für beide Wege |
| `skills/project-blueprint/SKILL.md` | Dasselbe als Cursor-Skill (Aufruf `/project-blueprint`) |
| `skills/project-blueprint/references/*` | Vertiefung: Regeln, Vorlagen, Prüftabellen |

Vertiefende Referenzen:

| Datei | Inhalt |
|---|---|
| `intake.md` | Fragenkatalog und Ergebnisform |
| `geruest.md` | Struktur, Skripte, Umgebungen, Geheimnisse |
| `datenmodell.md` | Migrationen, Indizes, Zugriffsregeln, Funktionen |
| `code-schicht.md` | Module, Konventionen, Fehlerbehandlung, externe Dienste |
| `rag-pipeline.md` | Chunking, Vektoren, Hybridsuche, Qualitätsmessung |
| `ci-cd.md` | Qualitätstore, Deploy, Vorschlagsfluss, Umgebungen |
| `verifikation.md` | vollständige Prüftabelle, Abnahmekriterien |
| `dokumentation.md` | Vorlagen für alle Dokumente |
| `regeln-und-fallen.md` | harte Regeln und teuer gelernte Fehler |

---

## Als Cursor-Skill installieren

Windows (PowerShell):

```powershell
git clone https://github.com/HofZeitV12/projekt-blueprint.git $env:TEMP\projekt-blueprint
Copy-Item -Recurse -Force $env:TEMP\projekt-blueprint\skills\project-blueprint `
  "$env:LOCALAPPDATA\Cursor\AgentStores\cursor_agent_stores\<deine-store-id>\files\skills\"
```

macOS / Linux:

```bash
git clone https://github.com/HofZeitV12/projekt-blueprint.git /tmp/projekt-blueprint
cp -r /tmp/projekt-blueprint/skills/project-blueprint \
  ~/.cursor/skills/          # bzw. in den Pfad deines Agent-Stores
```

Danach in Cursor `/project-blueprint` aufrufen.

---

## Lizenzen und Herkunft

Der Inhalt ist aus einem real betriebenen Projekt abgeleitet. Alle Regeln stammen aus
tatsächlichen Schäden: Datenverlust, offene Datenbanken, still vertauschte Inhalte, verlorene
Arbeit. Die Beispiele sind neutralisiert — keine Branche, kein Anbieter, kein Projektname.

Freie Verwendung. Siehe [LICENSE](LICENSE).
