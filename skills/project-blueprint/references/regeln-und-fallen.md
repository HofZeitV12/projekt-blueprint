# Harte Regeln und teuer gelernte Fehler

Alles hier stammt aus echten Schäden: Datenverlust, offene Datenbanken, still vertauschte
Inhalte, verlorene Arbeit. Die Regeln sind nicht Stilfragen.

## Sicherheit

1. **Keine echten Werte in getrackten Dateien.** Nicht in Vorlagen, nicht in Skripten, nicht
   in Testdateien, nicht in Kommentaren, nicht in Regeln.
2. **Entfernen ist keine Bereinigung.** Ein Wert in der Versionsgeschichte bleibt dort. Nur
   Rotation in der Quelle macht ihn unbrauchbar. Reihenfolge: melden → rotieren → entfernen.
3. **Serverschlüssel nur serverseitig.** Vollzugriff auf die Datenbank niemals in der
   Oberfläche, in einem öffentlichen Aufruf oder in einer öffentlichen Route. Auch nicht „nur
   kurz zum Testen".
4. **Funktionen mit erhöhten Rechten sind offene Türen**, wenn sie öffentlich aufrufbar sind.
   `revoke` von `public`, `anon`, `authenticated`; `grant` nur an die Serverrolle; `search_path`
   fest setzen.
5. **Immer prüfen, ob der Schutz greift.** Nach dem Anlegen mit der öffentlichen Rolle
   aufrufen — der Aufruf **muss** fehlschlagen. Ein gelungener Aufruf ist ein gefundener Fehler.
6. **Geheimes wird nicht indiziert.** Ausschluss an **drei** Stellen: Einreihen,
   Verarbeiten, Ersteinlesen. Nur an einer Stelle reicht nicht.
7. **Zugangsregister statt Werte.** In der Dokumentation steht, *wo* ein Wert liegt und *wer*
   ihn hat — nicht der Wert, nicht ein Ausschnitt, nicht ein Anfangsstück.
8. **Abzüge enthalten personenbezogene Daten.** Aufbewahrung festlegen und einhalten. Ein
   Abzug, der nie zurückgespielt wurde, ist kein Abzug.

## Datenbank

9. **Genau ein Migrationsordner.** Zwei Ordner verschlucken irgendwann eine Änderung.
10. **Eindeutige Zeitstempel.** Doppelte Kennungen machen die Reihenfolge unbestimmt, und der
    Fehler tritt später an unerwarteter Stelle auf. Prüfung gehört in die Automatisierung.
11. **Rein additiv.** Spalten entfernen ist ein eigener Vorgang mit Begründung und Sicherung.
12. **Wiederholbar schreiben.** `if not exists`, `or replace` — eine versehentlich doppelt
    ausgeführte Migration darf nicht zerstören.
13. **Namen einmal festlegen, dann überall gleich.** Ein historischer Tippfehler bleibt, wenn
    er überall steht — und wird **ausdrücklich dokumentiert**, damit ihn niemand „korrigiert".
14. **Erst begrenzen, dann Schwellen anwenden.** Bei der Ähnlichkeitssuche gehört die
    Begrenzung zuerst, die Schwelle danach — sonst wird der Index nicht genutzt und die
    Tabelle vollständig gelesen. Bei kleinen Datenmengen unsichtbar, später dramatisch.
15. **Zustandswerte als Wertebereich**, nicht als freier Text. Und der Wertebereich steht **in
    der Datenbank**, nicht nur im Code.
16. **Warteschlangen brauchen Versuchszähler, Reservierung und Zurücksetzen.** Eine
    Reservierung ohne Zeitstempel bleibt für immer hängen, wenn ein Lauf abstürzt.
17. **Teilweise eindeutige Indizes** lösen „nur eine Sache gleichzeitig" sauber — statt
    Prüfung im Code, die bei zwei gleichzeitigen Anfragen versagt.
18. **Typen werden generiert, nicht bearbeitet.** Von Hand geänderte generierte Dateien
    brechen beim nächsten Generieren.
19. **Vor riskanten Migrationen sichern.**

## Suche und Antworten

20. **`source_id` ist Text.** Kennungen sind gemischt; ein fester Typ bricht an der ersten
    Ausnahme.
21. **Kennung ohne Ausschnittszusatz** wird zitiert. `id#1` ist ein Ausschnitt, nicht das
    Dokument.
22. **Prüfsumme des Inhalts** speichern, sonst wird bei jeder Änderung alles neu eingelesen.
23. **Obergrenze für Ausschnitte pro Quelle.** Ein Riesen-Dokument blockiert sonst die
    Warteschlange.
24. **Sprachkonfiguration muss zur Sprache der Inhalte passen.** Sonst sinkt die Treffer-
    qualität ohne Fehlermeldung.
25. **Ohne Messung ist Suche Bauchgefühl.** Fester Fragensatz, Recall@k, Grenze, die den
    Vorschlag blockiert.
26. **Bei leerer Suche nicht antworten.** Sagen, dass nichts gefunden wurde. Das ist die
    wichtigste Regel gegen erfundene Inhalte.
27. **Ein Zitat, das auf nichts zeigt, ist ein Fehler** — nicht eine Formalie.

## Fremde Dienste und Kosten

28. **Ein Modul pro Dienst.** Zugangsdaten, Zeitlimits, Wiederholungen an einem Ort.
29. **Zeitlimit bei jedem Aufruf.** Ohne Zeitlimit hängt die Anfrage bis zum Abbruch.
30. **Genau eine Wahrheit für Werte** (Preise, Grenzen, Modellnamen). Eine zweite Tabelle ist
    eine veraltete Tabelle.
31. **Wiederholen mit Grenze**, nicht endlos. Eine Wiederholung fängt Aussetzer.
32. **Aufrufe zählen.** Ohne Zählung kennt niemand die Kosten.
33. **Fehler nicht verschlucken.** Ein leeres `catch {}` verbirgt den nächsten echten Fehler.

## Betrieb

34. **Nie mehrere Entwicklungsprozesse auf demselben Bauverzeichnis.** Sie überschreiben sich
    gegenseitig, und es entstehen Fehler, die nichts mit der Ursache zu tun haben (z. B.
    „diese Route existiert nicht", obwohl sie existiert).
35. **`build` niemals neben einem laufenden Entwicklungsprozess.** Bei rätselhaften
    Typfehlern: alle stoppen, Bauverzeichnis löschen, neu bauen.
36. **Nie einen synchronen Netzwerkaufruf an ein Ereignis hängen, das bei jeder Änderung
    feuert.** Das kostet jedes Mal spürbar Zeit. Stattdessen gebündelt bei Sitzungsbeginn/-ende
    und losgelöst im Hintergrund.
37. **Vor Konfigurationsarbeit `git status` prüfen und sofort committen.** Mehrere
    gleichzeitige Sitzungen im selben Repository löschen **nicht gespeicherte** Änderungen —
    das ist mehrfach passiert.
38. **Typkonfiguration eng fassen.** Ein breites Muster zieht Unterprojekte und Build-Artefakte
    in jede Prüfung.
39. **Nach dem Deploy Protokolle lesen**, nicht neu deployen.
40. **Rückrollen statt vorwärts reparieren**, wenn ein Deploy die Ursache ist.
41. **Ein Qualitätstor darf nicht stumm ausfallen.** Ein Pflichtlauf mit „No jobs were run"
    blockiert jeden Vorschlag. Ursache beheben, nicht den Filter entfernen.
42. **Keine Pflichtprüfung bleibt dauerhaft deaktiviert.** Ein deaktivierter Job ist ein
    Versprechen, das gebrochen wird. Entweder reparieren oder entfernen.

## Dokumentation

43. **Entscheidungen vor der Umsetzung.** Hinterher geschriebene Entscheidungen sind
    Rechtfertigung.
44. **Jede Datei trägt einen Stand.** Datum oben, ohne Ausnahme.
45. **Veraltetes korrigieren oder löschen, nie ergänzen.** Ein Abschnitt „das gilt nicht mehr"
    ist eine Falle.
46. **Der Code gewinnt.** Widerspricht eine Aussage dem Code, wird sie korrigiert.
47. **Keine toten Verweise.** Ein Link, der nichts öffnet, ist ein Fehler.
48. **Nach jedem Vorfall ein Runbook-Eintrag.** Sonst kommt derselbe Vorfall wieder.
49. **Nach jedem Feature Dokumentation im selben Vorgang.** Später ist der Moment, in dem
    niemand mehr weiß, warum etwas so ist.

## Arbeitsweise

50. **Erst lesen, dann ändern.** Nie aus dem Gedächtnis annehmen, wie eine Datei aussieht.
51. **Jede Aussage über den Zustand braucht einen ausgeführten Befehl.** „Müsste laufen" ist
    keine Aussage.
52. **Kleinste sinnvolle Änderung.** Kein Umbau nebenbei.
53. **Konventionen des Projekts übernehmen**, nicht die eigenen.
54. **Nichts entfernen, was man nicht verstanden hat.**
55. **Nichts übernehmen, was zu einem anderen Projekt gehört.** Keine Projektkennungen, keine
    Zugangsdaten, keine Server, keine Repo-Namen.
56. **Am Ende jeder Phase melden:** was angelegt, wie geprüft, was offen. Kein „fertig" ohne
    Befehl.
