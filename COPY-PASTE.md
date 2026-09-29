# Kopiervorlagen

Zwei Wege. Wähle den, der in deiner Umgebung funktioniert.

---

## Weg A — Agent hat Netzwerkzugriff (empfohlen)

Ein Satz. Sonst nichts.

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/BOOTSTRAP.md
und arbeite es vollständig ab.
```

**Warum das funktioniert:** `BOOTSTRAP.md` ist in sich vollständig — Auftrag, Regeln, alle acht
Phasen, Prüftabelle und Abschlussformat. Die Vertiefungsdateien verlinkt es einzeln; der Agent
lädt nur nach, was er an der jeweiligen Stelle braucht. Das hält den Kontext klein.

### Wenn der Agent die URL nicht öffnen kann

Frag ihn, ob er die Datei über sein Netzwerk-Werkzeug holen kann. Kann er es nicht, nimm Weg B.

### Wenn du auf einen bestimmten Stand festnageln willst

Nimm den Commit-Hash statt `main`:

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/<COMMIT-HASH>/BOOTSTRAP.md
und arbeite es vollständig ab.
```

---

## Weg B — Ohne Netzwerkzugriff

Die Dateien liegen im Projekt, dann ein Satz.

```powershell
# Windows (PowerShell) – im Zielprojekt ausführen
Invoke-WebRequest -Uri "https://github.com/HofZeitV12/projekt-blueprint/archive/refs/heads/main.zip" -OutFile "$env:TEMP\pb.zip"
Expand-Archive "$env:TEMP\pb.zip" -DestinationPath "$env:TEMP\pb" -Force
Copy-Item "$env:TEMP\pb\projekt-blueprint-main\BOOTSTRAP.md" -Destination .
Copy-Item -Recurse -Force "$env:TEMP\pb\projekt-blueprint-main\skills" -Destination .
```

```bash
# macOS / Linux – im Zielprojekt ausführen
curl -L https://github.com/HofZeitV12/projekt-blueprint/archive/refs/heads/main.tar.gz \
  | tar xz --strip-components=1 -C . \
      projekt-blueprint-main/BOOTSTRAP.md projekt-blueprint-main/skills
```

Dann:

```
Lies BOOTSTRAP.md im Projektstamm und arbeite es vollständig ab.
```

Anschließend kannst du `BOOTSTRAP.md` und `skills/` behalten — sie sind eine gute Grundlage für
die eigene Dokumentation — oder löschen. Empfehlung: behalten und in `docs/` verschieben.

---

## Kurzfassung, wenn du nur einen Teil willst

Du musst nicht immer alles starten. Diese Sätze reichen für einzelne Phasen:

### Nur Dokumentation nachziehen (bestehendes Projekt)

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/skills/project-blueprint/references/dokumentation.md
Erstelle die Dokumentation für dieses Projekt: docs/START.md, docs/PROJEKT.md,
docs/RUNBOOK.md, ein Entscheidungsverzeichnis, README.md, CHANGELOG.md und AGENTS.md.
Lies zuerst den vorhandenen Code — erfinde nichts.
Was unklar ist, frag mich.
```

### Nur Qualitätstore einrichten

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/skills/project-blueprint/references/ci-cd.md
Richte das Qualitätstor und den Struktur-Lauf für dieses Projekt ein: Format, Typen, Tests,
Bau, doppelte Migrationskennungen, Erreichbarkeit nach dem Deploy.
Der Bauschritt benutzt Platzhalter-Werte, keine echten Geheimnisse.
```

### Nur Datenbankschema aufräumen

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/skills/project-blueprint/references/datenmodell.md
Prüfe das bestehende Schema gegen die Regeln dieser Referenz und melde die Abweichungen als
Liste — mit Beleg. Erst nach meiner Freigabe ändern.
```

### Nur Suche / RAG aufsetzen

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/skills/project-blueprint/references/rag-pipeline.md
Setze Volltext- und Ähnlichkeitssuche nach dieser Referenz auf, inklusive Ausschluss von
Geheimem an drei Stellen und einem Prüflauf mit fester Mindestgüte.
```

### Nur prüfen, was schon da ist

```
Lies https://raw.githubusercontent.com/HofZeitV12/projekt-blueprint/main/skills/project-blueprint/references/verifikation.md
Arbeite die Prüftabelle für dieses Projekt ab. Führe jede Prüfung wirklich aus und zeige
Befehl und Ausgabe. Was fehlschlägt, meldest du als Befund mit Beleg — du reparierst es nicht
unaufgefordert.
```

---

## Was in den Bauauftrag gehört

Wenn du einen eigenen Auftrag formulierst, achte auf diese fünf Punkte. Ohne sie liefert der
Agent etwas anderes, als du willst:

| Punkt | Beispiel |
|---|---|
| **Ziel** | „Baue das Projektgrundgerüst auf" |
| **Umfang** | „Nur Phasen 1–4, keine Automatisierung" |
| **Reihenfolge** | „Erst fragen, dann bauen" |
| **Grenze** | „Nichts aus anderen Projekten übernehmen" |
| **Belegpflicht** | „Jede Zustandsaussage mit Befehl und Ausgabe" |

---

## Was du erwarten darfst

Der Agent **beginnt zu arbeiten** — aber er legt nicht blind los. Zuerst stellt er die Fragen,
die eine Struktur erzwingen (Datenbank, Geheimnisse, durchsuchbare Inhalte, Abnahmekriterium).
Erst danach baut er.

Er **wartet** auf deine Antworten. Das ist beabsichtigt: Eine Struktur, die auf Annahmen
gebaut ist, wird später vollständig umgebaut.

Er **meldet** am Ende jeder Phase, was er angelegt, womit er geprüft und was er offen gelassen
hat — mit echtem Befehl und echter Ausgabe. Ein „fertig" ohne Beleg ist nicht vorgesehen.
