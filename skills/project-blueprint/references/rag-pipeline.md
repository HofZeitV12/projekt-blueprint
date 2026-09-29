# Suche und RAG

Gilt für: **Volltextsuche**, **Ähnlichkeitssuche** und **Retrieval-gestützte Antworten** (RAG).
Diese Phase läuft nur, wenn das Intake ergeben hat, dass Inhalte durchsucht werden müssen.
Alles hier ist inhaltlich neutral — die Begriffe kommen aus dem Projekt.

## Entscheidung zuerst

| Frage | Konsequenz |
|---|---|
| Suchen Nutzer nach genauen Begriffen, Nummern, Namen? | **Volltextsuche** (Index, Sprachkonfiguration) |
| Suchen Nutzer nach Bedeutung, auch bei anderen Worten? | **Vektor-/Ähnlichkeitssuche** |
| Beides? | **Hybrid** mit Verschmelzung — fast immer die richtige Antwort |
| Sollen Antworten aus Inhalten entstehen? | Zusätzlich Retrieval + Antwortschicht (RAG) |

Ein Vektorindex ohne Volltextsuche scheitert an Eigennamen und Nummern. Ein Volltextindex
ohne Vektorindex scheitert an Umschreibungen. Hybrid ist der Standard.

## Aufbau

### 1. Ablage

Eine Tabelle für alle Suchinhalte, unabhängig von der Quelltabelle:

```sql
create table if not exists suchinhalt (
  id           uuid primary key default gen_random_uuid(),
  source_table text not null,          -- aus welcher Tabelle
  source_id    text not null,          -- welche Zeile (text, nicht uuid: Kennungen sind gemischt)
  chunk_text   text not null,          -- der eigentliche Textausschnitt
  embedding    vector(1536),           -- Dimension = Modell, siehe unten
  metadata     jsonb not null default '{}',
  created_at   timestamptz not null default now()
);

-- Verhindert doppelte Einträge pro Quelle
create unique index if not exists idx_suchinhalt_source_unique
  on suchinhalt (source_table, source_id);
```

Regeln:

- **`source_id` ist Text.** Fachliche Kennungen sind oft Zahlen, hier kommen sie gemischt an.
  Ein `uuid`-Typ bricht an der ersten Ausnahme.
- **Mehrere Ausschnitte:** `source_id = '<id>#<n>'`, und `metadata.parent_id = '<id>'`. Die
  Kennung ohne Zusatz ist das, was in Antworten zitiert wird.
- **`metadata.content_hash`** (Prüfsumme des Inhalts) macht erneutes Einlesen idempotent:
  gleicher Inhalt → kein zweiter Durchlauf.
- **`metadata.model` und `metadata.dimensions`** mitführen. Beim Modellwechsel ist sonst
  unklar, welche Zeilen noch gültig sind.
- **Einheitliche Dimension** innerhalb der Tabelle. Ein Modellwechsel braucht eine eigene
  Spalte oder eine eigene Tabelle.

### 2. Einlesen (Indexierung)

Der Index muss *von allein* aktuell bleiben, sonst veraltet er still.

**Zwei Wege, oft beide:**

| Weg | Wann | Wie |
|---|---|---|
| Auslöser in der Datenbank | Immer, wenn Zeilen geschrieben werden | `after insert or update of <felder>` → Auftrag einreihen |
| Warteschlange | Wenn das Einlesen teuer ist (externe Schnittstelle) | Einreihen, getrennt abarbeiten |

```sql
create table if not exists index_queue (
  id           uuid primary key default gen_random_uuid(),
  source_table text not null,
  source_id    text not null,
  action       text not null check (action in ('upsert','delete')),
  status       text default 'pending' check (status in ('pending','processing','done','error')),
  attempts     int not null default 0,
  claimed_at   timestamptz,
  error_msg    text,
  created_at   timestamptz default now(),
  processed_at timestamptz
);

-- Pro Quelle nur ein offener Auftrag
create unique index if not exists idx_index_queue_inflight
  on index_queue (source_table, source_id)
  where status in ('pending','processing');
```

**Wichtig:** Der Auslöser filtert Geheimes **vor** dem Einreihen aus. Geheime Zeilen werden
weder eingelesen noch je in Suchergebnisse geliefert.

### 3. Indizes

```sql
-- Ähnlichkeitssuche
create index if not exists idx_suchinhalt_hnsw
  on suchinhalt using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Volltext, Sprachkonfiguration passend zur Sprache der Inhalte
alter table suchinhalt
  add column if not exists search_vector tsvector
  generated always as (to_tsvector('<sprache>', coalesce(chunk_text,''))) stored;

create index if not exists idx_suchinhalt_fts
  on suchinhalt using gin (search_vector);
```

Die **Sprachkonfiguration** muss zur Sprache der Inhalte passen. Sonst werden Wortstämme
falsch behandelt und die Trefferqualität sinkt, ohne dass ein Fehler auftritt.

### 4. Chunking

Zerlegen der Inhalte ist entscheidend für die Trefferqualität.

| Regel | Wert / Grund |
|---|---|
| Größe | ca. 1800–2000 Zeichen (~450–500 Wörter) |
| Überlappung | ca. 300 Zeichen, damit kein Satz an der Grenze zerbricht |
| **Obergrenze** pro Quelle | z. B. 12 Ausschnitte — sonst blockiert ein Riesen-Dokument alles |
| Kleiner Inhalt | nicht zerlegen, ein Ausschnitt |
| Leerer Inhalt | nicht einreihen |

### 5. Suchfunktionen

Aufwendige Suche gehört in **eine** Funktion in der Datenbank (siehe `datenmodell.md` zur
Rechtevergabe und zum `search_path`).

**Reine Ähnlichkeitssuche:**

```sql
-- Reihenfolge ist entscheidend:
--   1. nächste Nachbarn holen (limit)          ← Index wird genutzt
--   2. dann die Schwelle anwenden              ← sonst wird der Index übersprungen
```

Wird die Schwelle **vor** der Begrenzung angewendet, liest die Datenbank die ganze Tabelle.
Das fällt bei kleinen Datenmengen nicht auf und später dramatisch.

Bei Vektorsuche zusätzlich innerhalb der Funktion setzen:

```sql
perform set_config('hnsw.ef_search', '100', true);
```

**Hybrid mit Verschmelzung (RRF):**

1. Beide Wege getrennt über einen **großen Kandidatenvorrat** ranken (z. B. je 50).
2. Über die **gegenseitige Rangfolge** verschmelzen:
   `beitrag = 1 / (k + rang)`, mit `k = 60`. Gezählt wird der Rang, nicht der Abstand — das
   macht die beiden Listen vergleichbar.
3. Ein Treffer, der in beiden Listen weit oben steht, gewinnt.
4. Erst danach auf das Ergebnislimit kürzen.

Eine Volltextabfrage, die scheitert, darf die Vektorsuche nicht mitnehmen: die Umwandlung in
eine Suchabfrage absichern (`exception when others then null`).

### 6. Qualität messen

**Ohne Messung ist Suche Bauchgefühl.** Ein fester Fragensatz mit erwarteten Antworten
(`tools/fragen.json`):

| Feld | Bedeutung |
|---|---|
| `frage` | echte Nutzerfrage |
| `expected` | mindestens einer dieser Begriffe muss in den Top-k stehen |
| `forbidden` | diese Begriffe dürfen **nicht** auftauchen (Leak-Prüfung) |
| `expectEmpty` | gewollt leer — Frage außerhalb des Bestands |
| `expectCite` | die richtige Quelle muss zitiert werden |

Gemessen werden:

| Kennzahl | Aussage |
|---|---|
| **Recall@k** | Anteil Fragen, bei denen die Antwort in den Top-k steht — die wichtigste Kennzahl |
| **MRR** | durchschnittlicher Kehrwert des Rangs des ersten Treffers — wie weit oben |
| **Kosten** | Summe der Einbettungs-Token |
| **Weg** | über die Datenbank oder über den Rückfallweg im Code |

Jeder Lauf wird **gespeichert** (Tabelle `suchlaeufe`: Kennzahl, Umgebung, Commit, Version des
Fragensatzes, Einzelbefunde). Nur so ist ein Rückschritt sichtbar.

**Grenze setzen und erzwingen.** Ein Prüflauf, der eine Mindestgüte unterschreitet, scheitert
(Fehlerausgabe ≠ 0) und blockiert damit den Vorschlag.

### 7. Antwortschicht (RAG)

Wer Antworten aus den Inhalten erzeugt, hält sich an fünf Regeln:

1. **Bei leerer Suche nicht antworten.** Klar sagen, dass nichts gefunden wurde. Das ist die
   wichtigste Regel — sie verhindert erfundene Inhalte.
2. **Gefundene Inhalte voranstellen**, allgemeines Wissen danach. Der Abschnitt mit
   Suchtreffern steht oben und ist als solcher gekennzeichnet.
3. **Quellen kennzeichnen**, in einem festen Format und mit der Kennung **ohne** Ausschnitts-
   zusatz: `[cite:<tabelle>#<id>]`.
4. **Zuerst nur Suchtreffer**, andere Quellen nur ergänzend — und nie, wenn die Suche leer war.
5. **Zitierte Quellen müssen existieren.** Ein Zitat, das auf nichts zeigt, ist ein Fehler.

**Aufbau des Kontexts:**

- Jeder Eintrag bekommt einen Relevanzwert (Priorität des Eintrags, Aktualität, Übereinstimmung
  mit der Frage, Längenstrafe bei zu kurzem oder zu langem Inhalt).
- Im Kontext sichtbar machen: `[R87/P8]` — Relevanz und Priorität.
- **Token-Budget** aus der Konfiguration, nicht hart im Code. Bei ~90 % des Budgets den
  betroffenen Block kürzen, nicht einzelne Zeichen abschneiden.
- Bei leerer Suche einen Hinweisblock voranstellen: nichts erfunden, sagen was fehlt.

## Ausschluss von Geheimem

**Dreifach anwenden** — an einer Stelle allein genügt nicht:

1. **Im Auslöser** (SQL): gar nicht erst einreihen.
2. **Im Code**: beim Lesen erneut filtern (eine Datei, alle Lesepfade importieren sie).
3. **Beim Ersteinlesen** (Stapelverarbeitung): dieselbe Ausschlussliste.

Muster für Namen: `credential|secret|password|passwd|token|api[_-]?key|\.access$`
plus ein Muster für **echte Werte** im Text (bekannte Präfixe, Zeichenketten in
Schlüsselform). Ein Eintrag, der wie ein Schlüssel aussieht, wird nicht eingelesen.

In der Dokumentation die Liste der ausgeschlossenen Quellen führen — der Inhalt selbst kommt
in keinen Text, keinen Kommentar und keine Regel.

## Modell und Kosten

- Einbettungen über eine externe Schnittstelle. **Modell und Dimension stehen in der
  Konfigurationsdatei** (siehe `code-schicht.md` → eine Wahrheit pro Wert).
- Eingabetext auf ein sicheres Maximum kürzen, bevor die Schnittstelle aufgerufen wird.
- **Tokenzahl mitzählen** und je Lauf speichern.
- Wiederholen mit Grenze bei Netzwerkfehlern.
- Ein Modellwechsel erfordert vollständiges Neueinlesen — als Vorgang planen, nicht nebenbei.

## Prüfliste

- [ ] Suchtabelle mit einheitlicher Dimension und eindeutigem Quellindex
- [ ] Auslöser reihen bei Änderung ein, **Geheimes ausgeschlossen**
- [ ] Warteschlange mit Versuchszähler, Reservierung und Zurücksetzen
- [ ] Ähnlichkeitsindex **und** Volltextindex vorhanden
- [ ] Suchfunktion: erst begrenzen, dann Schwellen anwenden
- [ ] Hybrid verschmilzt über Rangfolge, nicht über Abstände
- [ ] Auslöser-Funktion: Rechte entzogen, nur Serverrolle darf aufrufen
- [ ] Fragensatz vorhanden, mit Leer- und Leak-Prüfungen
- [ ] Prüflauf misst Recall@k und MRR und **scheitert** unter der Grenze
- [ ] Läufe gespeichert, mit Umgebung und Commit
- [ ] Bei leerer Suche: keine Antwort erfunden
- [ ] Zitate nach festem Format, Kennung ohne Ausschnittszusatz
