# Datenmodell

## Der eine Grundsatz

**Das Schema steht im Repository, nicht im Dashboard.** Jede Änderung an Tabellen, Spalten,
Indizes, Funktionen oder Zugriffsregeln liegt als versionierte Migrationsdatei vor. Wer nur
im Dashboard klickt, hat ein Schema, das niemand reproduzieren kann.

## Migrationen

| Regel | Grund |
|---|---|
| Eine Datei pro Änderung, Name `JJJJMMTTHHMMSS_kurz_slug.sql` | Zeitstempel ordnet die Reihenfolge, Slug erklärt den Zweck |
| **Ein** Ordner im ganzen Projekt | Zwei Ordner verschlucken irgendwann eine Änderung |
| Eindeutige Zeitstempel | Doppelte Kennungen brechen die Reihenfolge. Ein CI-Job prüft das |
| **Rein additiv** | Spalten und Tabellen hinzufügen, nicht entfernen. Entfernen ist ein eigener, begründeter Vorgang |
| Nach jeder Änderung Typen generieren | Die Anwendung und das Schema dürfen nicht auseinanderlaufen |
| Wiederholbar schreiben (`if not exists`, `or replace`) | Eine versehentlich doppelt ausgeführte Migration darf nicht zerstören |

Ein Prüflauf auf doppelte Kennungen ist die billigste Absicherung, die es gibt:

```bash
ls db/migrations/*.sql | sed 's/.*\///' | cut -d_ -f1 | sort | uniq -d
```

Findet der Befehl etwas, ist die Reihenfolge unbestimmt und der Fehler tritt später auf, an
einer unerwarteten Stelle.

## Namen

Einmal festlegen, dann **überall** gleich schreiben — in der Datenbank, im Code, in der
Dokumentation, in Fehlermeldungen.

- **Sprache:** Die Namen des Fachbereichs in der Sprache der Nutzer oder in Englisch, aber
  nicht gemischt pro Tabelle.
- **Ein historischer Tippfehler bleibt**, wenn er bereits in vielen Stellen steckt — aber er
  wird ausdrücklich dokumentiert, damit ihn niemand „korrigiert" und das System bricht.
- **Keine Namen, die zwei Dinge bedeuten.** `status` allein ist mehrdeutig, wenn es mehrere
  Zustandsmodelle gibt.
- **Zustandswerte als Wertebereich** (Aufzählung oder Prüfbedingung), nicht als freier Text.
  Freier Text macht Auswertungen unmöglich.

## Zustandsmodelle

Jeder Zustandsautomat gehört dokumentiert, mit erlaubten Übergängen:

```
ausstehend → offen → in Bearbeitung → bereit → abgeschlossen
                  ↳ abgebrochen
```

Regeln:

- Der erlaubte Wertebereich steht **in der Datenbank** (Prüfbedingung), nicht nur im Code.
- Ein Zustandswechsel bekommt einen Zeitstempel (`…_am`), damit man später messen kann.
- Wer einen Zustand weiterschiebt, prüft den Ausgangszustand — sonst sind Rennen möglich,
  wenn zwei Wege dieselbe Zeile anfassen.

## Indizes

| Situation | Index |
|---|---|
| Fremdschlüssel | immer indexieren |
| Häufige Filter (`status`, `kunde_id`) | eigener Index |
| Sortierung (`created_at DESC`) | Index in Sortierrichtung |
| Liste von Werten (`tags[]`) | GIN-Index |
| Suche über Text | Volltextindex, Sprachkonfiguration passend zur Dokusprache |
| Ähnlichkeitssuche | Vektorindex (siehe `rag-pipeline.md`) |
| Eindeutigkeit eines natürlichen Schlüssels | eindeutiger Index |
| „Nur eine Sache gleichzeitig" | **teilweiser** eindeutiger Index mit Bedingung |

Der teilweise eindeutige Index löst eine ganze Fehlerklasse. Beispiel: pro Quelle darf nur
ein Auftrag gleichzeitig offen sein —

```sql
create unique index if not exists idx_queue_inflight
  on queue (source_table, source_id)
  where status in ('offen', 'laufend');
```

Vor jedem neuen Index: Prüfen, ob schon einer existiert, und den Ausführungsplan der
betroffenen Abfrage ansehen. Ein Index, der nicht genutzt wird, kostet nur Schreibleistung.

## Zugriffsregeln

Zugriffsregeln gehören **ab Tag eins** ins Schema, nicht „später".

**Zwei Rollen, klar getrennt:**

| Rolle | Darf | Wo benutzt |
|---|---|---|
| Öffentlich | nur was ausdrücklich erlaubt ist | Anwendung, Browser, öffentliche Endpunkte |
| Server | alles | nur serverseitige Routen, Wartung, geplante Läufe |

Regeln:

1. **Regeln einschalten** (`enable row level security` oder das Äquivalent) für **jede**
   Tabelle mit personenbezogenen oder internen Daten.
2. **Standard ist verboten.** Erst die Regeln einschalten, die etwas erlauben.
3. **Die öffentliche Rolle bekommt nur, was sie braucht.** Lesen von öffentlichen Inhalten ja,
   schreiben nein — außer es ist fachlich gewollt und geprüft.
4. **Die Serverrolle umgeht die Regeln** — sie gehört niemals in die Oberfläche.
5. **Funktionen mit erhöhten Rechten** sind ein eigenes Risiko: Sie laufen mit den Rechten des
   Erstellers.

### Funktionen mit erhöhten Rechten

Eine Funktion, die mit erhöhten Rechten läuft, ist ein offener Zugang, wenn sie öffentlich
aufrufbar ist. Pflicht bei jeder solchen Funktion:

```sql
revoke all on function public.funktionsname(…) from public;
revoke all on function public.funktionsname(…) from anon, authenticated;
grant execute on function public.funktionsname(…) to service_role;
```

Zusätzlich: `set search_path = public` setzen, damit die Funktion nicht über einen
veränderten Suchpfad angreifbar ist.

**Prüfen gehört dazu:** Nach dem Anlegen mit der öffentlichen Rolle aufrufen — der Aufruf muss
**fehlschlagen**. Ein Aufruf, der gelingt, ist ein gefundener Fehler, kein Nebenbefund.

## Suchfunktionen serverseitig

Aufwendige Abfragen (Vektorsuche, Volltext mit Verschmelzung) gehören in **eine** Funktion in
der Datenbank, nicht in mehrfach kopierten Anwendungscode. Dann gilt eine Wahrheit, und die
Datenbank kann mit dem Ausführungsplan arbeiten.

Zwei Fallen, die regelmäßig auftreten:

1. **Zuerst einschränken, dann filtern.** Wird eine Schwelle **vor** der Begrenzung
   angewendet, kann der Planer den Index nicht nutzen und liest die ganze Tabelle.
   Reihenfolge: nächste Nachbarn holen (`limit`) → dann Schwelle anwenden → Ergebnis liefern.
   Bei Vektorsuche: die Parametersuche (`ef_search`) **innerhalb** der Funktion setzen.

2. **Ergebnis als `jsonb` zurückgeben**, wenn Mehrfachwerte geliefert werden. Das vermeidet
   Formatstreit zwischen Datenbank und Anwendung und ist in beiden Welten direkt lesbar.

## Wiederkehrende Aufgaben in der Datenbank

Aufgaben, die regelmäßig laufen und nur die Datenbank brauchen (Aufräumen, Zurücksetzen
hängender Zustände, Warteschlangen freigeben), gehören als Funktion in die Datenbank — nicht
in einen Anwendungsaufruf, der ausfallen kann.

Zwei Funktionen sind fast immer sinnvoll:

| Funktion | Aufgabe |
|---|---|
| `claim_…(limit)` | Arbeit reservieren. Mit `for update skip locked`, damit mehrere Läufe sich nicht behindern |
| `reclaim_…(minuten)` | Verwaiste Reservierungen zurücksetzen, die älter als N Minuten sind |

Warteschlangen-Regeln:

- Zustand je Eintrag: `wartend → laufend → fertig` bzw. `fehler`.
- **Versuche zählen** und nach N Versuchen endgültig auf `fehler` setzen, mit Fehlertext.
- **Zeitstempel** für Reservierung (`claimed_at`) und Verarbeitung (`processed_at`).
- Ein partieller eindeutiger Index verhindert, dass dieselbe Quelle doppelt eingereiht wird.
- Fortschritt wird als **Schätzung** berechnet (`fertig / gesamt`), nie als genau gezählt.

## Wiederherstellung

1. **Abzüge** der Produktionsdatenbank einrichten und **einmal wirklich zurückspielen** — ein
   Abzug, der nie getestet wurde, ist kein Abzug.
2. Abzüge enthalten personenbezogene Daten: Aufbewahrungsdauer festlegen und einhalten.
3. Löschkonzept je Tabelle: Wie lange darf jede Tabelle Daten halten? (Siehe
   `dokumentation.md` → Datensatzverzeichnis.)
4. Vor jeder riskanten Migration: Abzug oder zumindest die betroffenen Zeilen sichern.

## Reihenfolge beim Anlegen

```
1. Kern-Tabellen ohne Fremdschlüssel
2. Tabellen mit Fremdschlüsseln
3. Wertebereiche und Prüfbedingungen
4. Indizes
5. Zugriffsregeln einschalten + Regeln schreiben
6. Funktionen (mit Rechteentzug)
7. Warteschlangen-Funktionen
8. Ausgangsdaten, falls nötig
9. Typen generieren
10. Sicherheits- und Leistungshinweise des Anbieters abarbeiten
```
