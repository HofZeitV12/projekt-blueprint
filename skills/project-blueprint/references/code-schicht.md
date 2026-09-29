# Code-Schicht

## Aufteilung

| Ebene | Verantwortung | Regel |
|---|---|---|
| Endpunkte / Routen | Eingabe prüfen, Fachlogik aufrufen, Antwort formen | **Keine** Fachlogik in der Route |
| Fachlogik (`lib/<bereich>`) | Die eigentliche Arbeit | Eine Datei pro Verantwortung |
| Datenzugriff | Lesen und Schreiben | Ein Ort pro Tabelle |
| Konfiguration (`lib/config`) | Werte, Grenzen, Preise | **Eine** Quelle pro Wert |
| Oberfläche | Darstellung und Interaktion | Keine Zugangsdaten, keine Fachlogik |

Der Test: Kann man die Fachlogik ohne laufende Oberfläche prüfen? Wenn nein, ist sie falsch
aufgeteilt.

## Eine Wahrheit pro Wert

Der häufigste Schaden in gewachsenen Projekten sind **doppelte Wahrheiten**: eine Liste von
Werten, die an drei Stellen steht und an zwei davon veraltet ist.

Konkrete Regeln:

- Preise, Grenzwerte, Modellnamen, Aufzählungen, Fristen, Gebühren: **eine** Datei, und alle
  anderen Stellen lesen daraus.
- Keine Kopie in der Dokumentation. Die Dokumentation **verweist** auf die Datei, statt die
  Werte zu wiederholen. Eine Zahl in zwei Dokumenten ist eine Zahl zu viel.
- Kommentar am Kopf der Datei: „Einzige Wahrheit für …".

## Fehlerbehandlung

Einheitlich, an jeder Grenze. Nach außen eine verständliche Meldung, nach innen der echte
Fehler:

```ts
try {
  // Arbeit
  return Response.json({ data });
} catch (err) {
  console.error('[Bereich] Fehler:', err);          // voller Fehler ins Protokoll
  return Response.json(
    { error: 'Benutzerfreundliche Nachricht' },      // keine Interna nach außen
    { status: 500 }
  );
}
```

Regeln:

- **Niemals Interna nach außen.** Keine Stapelspuren, keine Abfragen, keine Zugangsdaten in
  Fehlerantworten.
- **Jeder Fehler wird protokolliert**, mit Bereichspräfix, damit man ihn findet.
- **Unterscheiden:** Eingabefehler (4xx) gegen Systemfehler (5xx). Ein Eingabefehler ist kein
  Vorfall.
- **Fehler nicht verschlucken.** Ein leeres `catch {}` verbirgt den nächsten echten Fehler.
  Wenn ein Fehler bewusst ignoriert wird, steht ein Kommentar mit Grund dabei.
- **Wiederholen mit Grenze.** Netzwerkaufrufe einmal wiederholen, dann aufgeben und melden.

## Externe Dienste

Jeder externe Dienst bekommt **ein** Modul. Kein Zugriff verstreut über das Projekt.

| Regel | Grund |
|---|---|
| Eine Datei pro Dienst | Ein Ort für Zugangsdaten, Wiederholungen, Zeitlimits |
| **Zeitlimit** bei jedem Aufruf | Ohne Zeitlimit hängt die Anfrage bis zum Abbruch der Laufzeit |
| Wiederholung mit Grenze | Eine Wiederholung fängt Aussetzer, mehr verschlimmert sie |
| Aufrufe zählen und protokollieren | Ohne Zählung weiß man nicht, was das Projekt kostet |
| Ausfall sichtbar machen | Ein Dienst, der still ausfällt, ist schlimmer als einer, der laut ausfällt |
| Bereitschaft prüfen (`isReady()`) | Eine fehlende Konfiguration wird zur klaren Meldung statt zum Folgefehler |

## Hintergrundarbeit und geplante Läufe

Wenn die Laufzeitumgebung nur **einen** Zeitplan erlaubt, orchestriert **ein** Einstiegspunkt
mehrere Teilaufgaben in fester Reihenfolge:

```
1. Arbeit, die den Zustand frisch hält   (billig, kritisch)
2. Aufräumen und Zurücksetzen hängender Zustände
3. Prüfungen und Statusberichte
4. Teure Arbeit zuletzt                   (darf bei Zeitüberschreitung ausfallen)
```

**Die Regel dahinter:** Was teuer und verzichtbar ist, läuft zuletzt. Sonst sterben bei einer
Zeitüberschreitung zuerst die billigen und kritischen Schritte.

Weiter:

- Jeder Teilauftrag bekommt ein **eigenes Zeitlimit** und meldet Erfolg, Dauer und Kurzbefund.
- Der Gesamtlauf liefert eine Zusammenfassung `erfolgreich/gesamt` plus die Einzelbefunde.
- **Zeitpläne dokumentieren**, mit welcher Ausdrucksform sie laufen.
- **Nie zwei Einstiegspunkte, die dasselbe tun** — sonst laufen sie gegeneinander.

## Lange Arbeit und Warteschlangen

Arbeit, die länger dauert als eine Anfrage leben darf, gehört in eine Warteschlange:

1. Zustand speichern (`wartend`), Antwort sofort zurückgeben.
2. Ein Arbeiter holt Arbeit (`claim`), verarbeitet, markiert `fertig` oder `fehler`.
3. Fortschritt in Prozent wird berechnet, nicht gezählt — sonst sieht man nach einem Neustart
   falsche Werte.
4. Nach N Fehlversuchen endgültig aufgeben, mit Fehlertext.

## Oberfläche

- **Zustände sind Pflicht:** leer, lädt, Fehler, Erfolg. Ein Bildschirm, der nur den
  Erfolgsfall kennt, ist nicht fertig.
- **Kein Zugangsdatum in der Oberfläche** außer ausdrücklich öffentlichen Werten.
- **Absichten trennen.** Eine destruktive Handlung fragt nach, eine harmlose nicht.
- **Barrierefreiheit ab Tag eins:** Tastaturbedienbar, sichtbarer Fokus, ausreichender
  Kontrast, beschriftete Eingaben, sinnvolle Reihenfolge.
- **Keine Textwand als Fehlermeldung.** Was ist passiert, was kann man tun.

## Änderungen an bestehendem Code

1. **Lesen, nicht annehmen.** Die Datei öffnen, bevor sie geändert wird.
2. **Kleinste sinnvolle Änderung.** Kein Umbau nebenbei.
3. **Konventionen des Projekts übernehmen**, nicht die eigenen.
4. **Nichts entfernen, was man nicht versteht.** Erst klären, dann löschen.
5. **Nach der Änderung prüfen**, nicht hoffen: Typen, Tests, Build.

## Reihenfolge beim Aufbau

```
1. Konfiguration (eine Wahrheit pro Wert)
2. Datenzugriff
3. Fachlogik
4. Schnittstellen zu externen Diensten
5. Endpunkte
6. Oberfläche
7. Hintergrundarbeit
```
