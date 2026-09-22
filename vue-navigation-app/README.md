# Insight Fitness – Vue Navigation

Vue 3 mit TypeScript, Vue Router und dem bereits eingebundenen Pinia. Die App enthält
20 Übungen und 12 synthetische Trainings. Eigene Trainings lassen sich zusätzlich
im Browser speichern. Es wurden keine Packages hinzugefügt.

## Lokal starten und prüfen

Im Verzeichnis `vue-navigation-app`:

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

Ein Lint-Script ist nicht eingerichtet. Der Integrationstest benötigt den laufenden
Vite-Devserver und den lokal installierten Edge-Browser:

```sh
node scripts/test-browser.mjs
```

Optional setzen `TEST_ORIGIN` und `BROWSER_PATH` eine andere lokale Serveradresse
bzw. einen Chromium-Browser. Der Test verwendet ein separates temporäres Browserprofil,
keine persönlichen Browserdaten. Resultate und Screenshots stehen in dem von Git
ignorierten Verzeichnis `test-results.local/`. Die Tests benötigen keine zusätzlichen
Test-Packages. Für eine Wiederholung wird ein neues Profil angelegt.

## Routen

| Pfad | Name / Verhalten |
| --- | --- |
| `/` | Redirect auf `trainings` |
| `/trainings` | `trainings` – Übersicht mit Filtern und Sortierung |
| `/trainings/new` | `training-create` – neues Training erfassen |
| `/trainings/:id` | `training-detail` – synthetisches oder gespeichertes Training |
| `/exercises` | `exercises` – Übungskatalog mit Suche und Filtern |
| `/exercises/:id` | `exercise-detail` – Bild, Beschreibung, Ausführung, Alternativen |
| alle anderen Pfade | `not-found` – 404 |

Alle Views werden weiterhin lazy geladen. Die statische Erstellroute steht vor der
dynamischen Trainingsroute. Named Routes, RouterLink, RouterView, useRoute und useRouter
werden verwendet. Nicht vorhandene oder ungültige IDs zeigen einen Hinweis mit
Rückweg zur Übersicht. Parameterwechsel zwischen alternativen Übungen aktualisieren
Inhalt und Bild ohne vollständigen Seiten-Reload.

Der Router verwendet HTML5-History. Vite unterstützt direkte URLs und Reloads.
Beim Deployment muss der Webserver unbekannte Anwendungspfade auf `index.html`
zurückführen; das ist eine Hosting-Einstellung und kein zusätzlicher App-Server.

## Speicherung und Validierung

`src/stores/trainings.ts` ist der zentrale Pinia-Store. Er lädt beim App-Start die
synthetischen Trainings und ein JSON-Array eigener Trainings aus `localStorage`
unter dem Schlüssel `insight-fitness.trainings.v1`. Gespeichert werden ausschließlich
eigene Trainings im vorhandenen `Training`-Modell. Übersicht, Detailseite und
`getTrainingById()` lesen denselben reaktiven Datenbestand.

Defektes JSON, falsche Datenformen, ungültige Referenzen, ungültige Sets und doppelte
IDs werden abgefangen. Bei ID-Konflikten bleiben die synthetischen Daten und der
erste gültige gespeicherte Eintrag erhalten. Ungültige Einträge werden ignoriert und
ein Hinweis erscheint. Lesen verändert den gespeicherten Inhalt nicht. Ein erfolgreiches
neues Speichern schreibt die gültigen gespeicherten Trainings plus den neuen Eintrag.

Vor jedem Speichern wird der Browserspeicher erneut gelesen. Die nächste ID ist die
höchste ID aus synthetischen, aktuell geladenen und erneut eingelesenen Trainings
plus eins. Der sichere Integer-Bereich wird geprüft. Wo die Web Locks API verfügbar
ist (einschließlich des getesteten Edge auf localhost), ist Lesen/ID-Vergabe/Schreiben
auch zwischen Tabs serialisiert. Ohne Web Locks erfolgt der Vorgang synchron;
gleichzeitige Schreibvorgänge verschiedener Tabs sind dort nicht vollständig geschützt.
Das `storage`-Event synchronisiert Änderungen anderer Tabs mit dem Store.

Erst nach erfolgreichem `setItem()` wird der Store aktualisiert und zur neuen Detailseite
navigiert. Bei gesperrtem oder vollem Speicher bleibt das Formular einschließlich aller
Eingaben erhalten. Die App bleibt auch bei nicht verfügbarem Speicher bedienbar.

Formular und Storage-Prüfung verwenden gemeinsam `src/utils/trainingValidation.ts`:

- echtes Kalenderdatum im Format YYYY-MM-DD; Standard ist das lokale heutige Datum;
- Trainingsart aus Push, Pull, Legs, Upper Body, Lower Body, Full Body oder Sonstiges;
- endliche Dauer größer als 0 Minuten;
- mindestens eine bekannte Übung, jede Exercise-ID höchstens einmal;
- mindestens ein gültiger Satz pro Übung;
- endliches Gewicht ab 0 kg; endliche, sichere ganzzahlige Wiederholungen größer als 0.

Leere Formularfelder werden mit aus den vorhandenen Typen abgeleiteten Draft-Typen
abgebildet. Sie werden niemals als gültige Trainings gespeichert. Fehlermeldungen stehen
an den Feldern und sind über ARIA mit den Inputs verbunden. Übungen und Sätze lassen
sich hinzufügen und entfernen; Übungen lassen sich mit Pfeilbuttons umsortieren.

## Gestaltung und Bilder

ExerciseCard und alternative Übungen verwenden dieselben `.card`, `.card__title`,
`.card__meta`, `.card__link` und AppIcon-Komponenten wie TrainingCard. Die vorhandenen
`.btn`, `.btn--secondary`, `.card-grid`, Farben, Abstände und Radien werden wiederverwendet.
Das bestehende Trainingsdesign bleibt erhalten. Das gemeinsame Card-Grid übernimmt
die bisherigen Trainings-Breakpoints (drei, zwei bzw. eine Spalte). Formulare ergänzen begrenzte Klassen
in `forms.css`; der doppelte `main`-Landmark in den Übersichten wurde entfernt.

Alle 20 Übungen haben eigene lokale SVG-Bewegungsskizzen mit einheitlicher Größe
720 × 360 und blau-grauem Stil. Sie zeigen zwei schematische Positionen; Plank zeigt
die Halteposition. Keine fremden Fotos oder externen Bild-URLs werden verwendet.
Die Skizzen sind vereinfachte Darstellungen und keine anatomischen Detailzeichnungen.

Die Bilder liegen unter `src/assets/exercises/` und sind direkt über die optionale
`Exercise.image`-Eigenschaft in `src/data/exercises.ts` zugeordnet. Statische Imports
lassen Vite die Pfade beim Build prüfen. `ExerciseImage.vue` verwendet sie gemeinsam
in Cards, auf Detailseiten und in der Auswahlvorschau. `object-fit: contain` vermeidet
Verzerrung. Fehlender Bildwert oder Ladefehler ergibt einen neutralen Icon-Bereich;
beim Übungswechsel wird der Fehlerzustand zurückgesetzt.

| Übung | SVG-Datei |
| --- | --- |
| Bankdrücken | bench-press.svg |
| Kurzhantel-Bankdrücken | dumbbell-bench-press.svg |
| Brustpresse | chest-press.svg |
| Kabelzug Flys | cable-fly.svg |
| Schulterdrücken | shoulder-press.svg |
| Seitheben | lateral-raise.svg |
| Klimmzüge | pull-up.svg |
| Latziehen | lat-pulldown.svg |
| Rudern am Kabelzug | cable-row.svg |
| Bizeps Curls | biceps-curl.svg |
| Trizeps Pushdown | triceps-pushdown.svg |
| Kniebeugen | squat.svg |
| Beinpresse | leg-press.svg |
| Beinstrecker | leg-extension.svg |
| Beinbeuger | leg-curl.svg |
| Romanian Deadlift | romanian-deadlift.svg |
| Wadenheben | calf-raise.svg |
| Plank | plank.svg |
| Crunches | crunch.svg |
| Liegestütze | push-up.svg |

Es fehlen keine Bilder. Die SVGs können direkt bearbeitet oder mit
`node scripts/generate-exercise-images.mjs` reproduziert werden; das Script enthält
die Zeichenkoordinaten und aktualisiert die Bildimporte im vorhandenen Übungskatalog.
Direkte SVG-Änderungen müssen für eine erneute Generierung auch im Script erfolgen.

## Geänderte und neue Dateien

Neue Komponenten:

- `src/components/TrainingForm.vue`: Grunddaten, Formulardraft, Validierung, Submit.
- `src/components/ExerciseSelector.vue`: Suche, Auswahl und Bildvorschau.
- `src/components/TrainingExerciseEditor.vue`: Reihenfolge, Gewicht, Wiederholungen und Sätze.
- `src/components/ExerciseImage.vue`: responsive Bilddarstellung und Fallback.

Weitere neue Dateien:

- `src/views/TrainingCreateView.vue`
- `src/stores/trainings.ts`
- `src/utils/trainingValidation.ts`
- `src/assets/styles/forms.css`
- die 20 oben aufgeführten Dateien in `src/assets/exercises/`
- `scripts/generate-exercise-images.mjs`
- `scripts/test-browser.mjs`

Geänderte Dateien:

- `src/main.js`, `src/router/index.js`, `src/utils/data.ts`
- `src/types/training.ts`, `src/types/exercise.ts`, `src/data/exercises.ts`
- `src/components/AppNavigation.vue`, `TrainingFilter.vue`, `ExerciseFilter.vue`, `ExerciseCard.vue`
- `src/views/TrainingsView.vue`, `TrainingDetailView.vue`, `ExercisesView.vue`, `ExerciseDetailView.vue`
- `src/assets/styles/main.css`, `src/assets/styles/base.css` und diese `README.md`

Die synthetischen Trainings, Übungsbeschreibungen und Ausführungsschritte wurden nicht
geändert. Die Datenprüfung fand keine doppelten IDs oder fehlerhaften Referenzen im
synthetischen Bestand. Ergänzt wurden die bisher fehlende Browser-Persistenz und
Erstellroute. `getExerciseAlternatives()` filtert nun zusätzlich Selbstreferenzen und
Duplikate. Die vorhandene strenge Parameterprüfung wurde weiterverwendet; ein bestehender
Router-Konflikt musste nicht repariert werden. Die neue statische Route wurde passend
eingeordnet, die aktive Navigation ergänzt und ein Rücklink im Trainingsdetail eingebaut.

## Teststand und Grenzen

45 Browserprüfungen mit Edge erfolgreich, darunter:

- kompletter Erstellablauf mit Bankdrücken (80×10, 85×8, 85×7) und Schulterdrücken;
- Übungsduplikate, Entfernen/erneutes Hinzufügen, Reihenfolge, Sets entfernen/ergänzen;
- Pflichtfelder, negative Gewichte, gebrochene Wiederholungen und Speicherfehler;
- Detailwerte, Übersicht, direkter Reload und tatsächlicher Browser-Neustart;
- Training → Übung → Alternative sowie Browser-Zurück/-Vorwärts;
- Root-Redirect, direkte Übersichts-/Detail-URLs, ungültige IDs und Catch-All;
- Suche/Filter, defektes/leeres/falsch strukturiertes Storage, doppelte IDs und Referenzen;
- Prüfung sämtlicher synthetischer Daten, fortlaufende IDs, parallele Speicheraufrufe;
- alle 20 Bilddateien, fehlendes Bild und tatsächlicher falscher Bildpfad;
- kein horizontaler Overflow auf 360, 768 und 1440 px für alle fünf relevanten Seiten;
- keine Vue-Warnings oder JavaScript-Console-Errors während dieser Abläufe.

Screenshots wurden zusätzlich visuell geprüft. `npm run typecheck` und `npm run build`
sind erfolgreich. Lint ist mangels vorhandenem Script nicht ausführbar. Für die bewusst
fehlerhafte Bild-URL wird erwartungsgemäß ein Ladefehler ausgelöst und durch den Fallback
behandelt.

Offene Grenzen: Das bestehende Satzmodell erfasst Wiederholungen, keine Haltezeit für
Planks. Wadenheben hat im bestehenden Katalog keine Alternative. Alternativen sprechen
ähnliche Muskeln an, sind aber nicht zwingend identische Bewegungen. Das bleibt unverändert.
Ein späterer Produktivhost benötigt den oben beschriebenen SPA-Fallback. Persistenz gilt
für dasselbe Browserprofil und denselben Origin; manuelles Löschen der Browserdaten
entfernt auch eigene Trainings. Eine Haltezeit-Erweiterung ist nicht Teil dieser Aufgabe.
