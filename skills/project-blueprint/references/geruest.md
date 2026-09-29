# Gerüst und Infrastruktur

## Ordnerstruktur

Nach Verantwortung trennen, nicht nach Dateityp. Eine Struktur, die sich in fast jedem
Projekt bewährt:

```
projekt/
├─ README.md              Was, wie starten, wie prüfen
├─ CHANGELOG.md           Was hat sich geändert
├─ AGENTS.md              Konventionen für Assistenten
├─ app/ oder src/         Anwendungsschicht (Seiten, Endpunkte)
├─ lib/                   Fachlogik, je Verantwortung eine Datei
│  └─ <bereich>/          Unterbereiche nur, wenn sie eigenständig sind
├─ components/            Wiederverwendbare Oberfläche
├─ db/migrations/         ODER supabase/migrations/ — genau EIN Ort
├─ tools/                 Betriebs-, Wartungs- und Prüfskripte
├─ docs/                  Dokumentation (siehe dokumentation.md)
├─ .github/workflows/     Automatisierung
├─ .cursor/rules/         Projektregeln für Assistenten
└─ tests/                 Tests, falls nicht neben dem Code
```

Regeln zur Struktur:

- **Ein Migrationsordner.** Zwei Ordner sind ein Fehler, der irgendwann eine Änderung
  verschluckt.
- **`lib/` nach Verantwortung**, nicht nach Technik. `lib/orders.ts` schlägt
  `lib/utils2.ts`.
- **Skripte, die man einmal ausführt, gehören nach `tools/`** und werden nicht in den
  Anwendungspfad importiert.
- **Nichts ohne Besitzer.** Ein Ordner, den niemand erklären kann, wird erklärt oder entfernt.

## Projektdatei

`package.json` (oder das jeweilige Gegenstück) trägt die wiederkehrenden Befehle. Alles, was
man öfter als zweimal tippt, wird ein Skript:

```json
{
  "scripts": {
    "dev": "…",
    "build": "…",
    "lint": "…",
    "test": "…",
    "types": "…",
    "check": "npm run lint && npm test && npm run build"
  }
}
```

`check` ist der Befehl, den ein Qualitätstor aufruft und den jeder vor dem Vorschlag laufen
lässt. Er muss lokal dasselbe Ergebnis liefern wie die Automatisierung.

## Typkonfiguration

Die Konfiguration **eng** fassen — nur die echten Quellordner einschließen:

```jsonc
{
  "include": ["app", "lib", "components", "tools", "tests"],
  "exclude": ["node_modules", ".next", "dist", "build", "unterprojekt-*"]
}
```

Ein breites Muster wie `**/*.ts` zieht Unterprojekte, Build-Artefakte und Fremdcode in jede
Prüfung und erzeugt Fehler, die niemand verursacht hat.

## Umgebungen und Werte

Drei Ebenen, sauber getrennt:

| Ebene | Datei | Im Repo? | Inhalt |
|---|---|---|---|
| Maschinell | `.env.local` | **nein**, ignoriert | echte Werte |
| Vorlage | `.env.example` | ja | **nur Platzhalter**, je Wert mit Bezugsquelle |
| Laufzeit | Hosting-Umgebungsvariablen | — | je Umgebung: Entwicklung, Vorschau, Produktion |

Regeln, die nicht verhandelbar sind:

- **Keine echten Werte in getrackten Dateien.** Nicht in Vorlagen, nicht in Skripten, nicht
  in Testdateien, nicht in Kommentaren.
- **Ignorierliste von Anfang an**, bevor der erste Commit entsteht:
  `.env*.local`, `.env`, `*.pem`, `*.key`, Zugangsdateien, Datenbankabzüge.
- **Entfernen ist keine Bereinigung.** Ein Wert, der einmal in der Versionsgeschichte liegt,
  bleibt dort. Nur **Rotation** in der Quelle macht ihn unbrauchbar. Wird ein Wert gefunden:
  melden, rotieren lassen, dann entfernen — nicht umgekehrt.
- **Öffentlichkeit kennzeichnen.** Ein Wert, der in die Oberfläche darf, bekommt das
  entsprechende Präfix (z. B. `PUBLIC_`, `NEXT_PUBLIC_`). Alles andere ist serverseitig.
- **Serverschlüssel nur serverseitig.** Ein Schlüssel mit Vollzugriff auf die Datenbank darf
  niemals in einer Komponente, in einem Browser-Aufruf oder in einer öffentlichen Route
  auftauchen.

Vorlage für `.env.example`:

```
# ============================================================
# Vorlage – nach .env.local kopieren und Werte eintragen.
# Diese Datei enthält NIEMALS echte Werte.
# ============================================================

# --- Datenbank ---
# Quelle: Dashboard → Einstellungen → API
DATABASE_URL=https://DEIN-PROJEKT.example
DATABASE_ANON_KEY=DEIN_OEFFENTLICHER_SCHLUESSEL
# NUR SERVERSEITIG – niemals in die Oberfläche
DATABASE_SERVICE_KEY=DEIN_SERVERSCHLUESSEL
```

## Infrastruktur anlegen

### Datenbank

1. Projekt auflisten, bestehendes ermitteln oder neu anlegen.
2. Vorhandene Struktur lesen: Tabellen, Migrationen, Erweiterungen. **Nicht annehmen.**
3. Erweiterungen prüfen und bei Bedarf aktivieren (Vektor-Suche, Zeitpläne).
4. Sicherheits- und Leistungshinweise des Anbieters einmal als Ausgangsstand abrufen.
5. Typen für die Anwendung generieren und committen — generierte Dateien nicht von Hand
   ändern.

### Repository

1. Privat anlegen, Hauptzweig `main`.
2. **Schutz des Hauptzweigs**: Vorschlagspflicht (kein Direktpush), Qualitätstor als
   Pflichtprüfung, keine erzwungenen Überschreibungen.
3. Werte für die Automatisierung als Repository-Geheimnisse setzen — **nicht** in
   Workflow-Dateien.
4. Vorlage für Vorschläge anlegen (`.github/pull_request_template.md`): Was, warum, wie
   geprüft, welche Dokumentation nachgezogen.

### Hosting

1. Projekt mit dem Repository verbinden. Diese Verbindung ist der Deploy-Pfad.
2. Umgebungsvariablen je Umgebung setzen — vollständig, sonst bricht der erste Deploy ohne
   klare Ursache ab.
3. Erster Deploy erst nach Phase 6 und 7.

## Startreihenfolge

```
Ignorierliste → Repository → Struktur → Abhängigkeiten → .env.example
→ Datenbank → Umgebungen → Migrationen → erste lauffähige Anwendung
```

Die Ignorierliste steht **vor** allem anderen. Ein Projekt, das mit einer Datei voller
Schlüssel beginnt, hat das Problem dauerhaft in der Geschichte.
