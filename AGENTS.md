# Konventionen für Assistenten

Diese Datei liest ein Assistent, der in diesem Repository arbeitet.

## Was dieses Repository ist

Eine **Vorlage**: ein erprobtes Vorgehen für Projektaufbau und Dokumentation. Kein Anwendungscode.

- `BOOTSTRAP.md` ist der Auftrag, den ein Agent lädt und abarbeitet.
- `skills/project-blueprint/` ist dieselbe Sache als Cursor-Skill, mit Vertiefungen.
- `COPY-PASTE.md` enthält die Einstiegssätze.

## Wie hier gearbeitet wird

1. **Erst lesen, dann ändern.** Die betroffene Datei öffnen, bevor sie geändert wird.
2. **Projektneutral bleiben.** Keine Branche, kein Anbieter, kein Projektname, keine Kennung.
   Die Vorlage muss in **jedem** Projekt funktionieren.
3. **Regeln nur mit Begründung.** Eine Regel ohne erklärten Schaden dahinter wird gestrichen —
   sie wird sonst irgendwann ignoriert.
4. **Keine echten Werte.** Auch keine Beispiele, die wie echte Schlüssel aussehen.
5. **Kleinste sinnvolle Änderung.** Kein Umbau nebenbei.
6. **Widerspruchsfreiheit.** Dieselbe Aussage darf nicht an zwei Stellen unterschiedlich
   stehen. Eine Zahl steht **einmal**; andere Stellen verweisen darauf.

## Aufbau

| Pfad | Bedeutung |
|---|---|
| `BOOTSTRAP.md` | Der eigenständige Auftrag. In sich vollständig, darf nicht von anderen Dateien abhängen |
| `skills/project-blueprint/SKILL.md` | Einstieg für den Skill-Aufruf |
| `skills/project-blueprint/references/` | Vertiefung, je Datei ein Thema |
| `README.md` | Was das ist und wie man es benutzt |
| `COPY-PASTE.md` | Fertige Einstiegssätze |

**`BOOTSTRAP.md` ist eigenständig.** Es verlinkt die Vertiefungen, setzt sie aber nicht voraus.
Wer nur diese eine Datei hat, kann arbeiten.

## Nach jeder Änderung

- [ ] Betrifft die Änderung `BOOTSTRAP.md` und den Skill? **Beide** nachziehen — sie müssen
      dieselben Phasen und Regeln beschreiben.
- [ ] `CHANGELOG.md` ergänzen
- [ ] Relative Verweise prüfen (der CI-Lauf prüft das automatisch)
- [ ] Keine projekt- oder branchenspezifische Formulierung eingeschlichen

## Bekannte Fallen

- **Zwei Fassungen auseinanderlaufen lassen.** `BOOTSTRAP.md` und die Skill-Dateien
  beschreiben dasselbe. Wird nur eine geändert, widersprechen sie sich — und der Agent liest
  die falsche.
- **Zu lang werden.** `BOOTSTRAP.md` muss in einen Kontext passen. Vertiefung gehört in
  `references/`, nicht in den Auftrag.
- **Ratschläge statt Regeln.** „Man sollte darauf achten" wirkt nicht. „Erst begrenzen, dann
  Schwellen anwenden" wirkt.
