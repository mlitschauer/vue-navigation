import exerciseImage1 from '@/assets/exercises/bench-press.svg'
import exerciseImage2 from '@/assets/exercises/dumbbell-bench-press.svg'
import exerciseImage3 from '@/assets/exercises/chest-press.svg'
import exerciseImage4 from '@/assets/exercises/cable-fly.svg'
import exerciseImage5 from '@/assets/exercises/shoulder-press.svg'
import exerciseImage6 from '@/assets/exercises/lateral-raise.svg'
import exerciseImage7 from '@/assets/exercises/pull-up.svg'
import exerciseImage8 from '@/assets/exercises/lat-pulldown.svg'
import exerciseImage9 from '@/assets/exercises/cable-row.svg'
import exerciseImage10 from '@/assets/exercises/biceps-curl.svg'
import exerciseImage11 from '@/assets/exercises/triceps-pushdown.svg'
import exerciseImage12 from '@/assets/exercises/squat.svg'
import exerciseImage13 from '@/assets/exercises/leg-press.svg'
import exerciseImage14 from '@/assets/exercises/leg-extension.svg'
import exerciseImage15 from '@/assets/exercises/leg-curl.svg'
import exerciseImage16 from '@/assets/exercises/romanian-deadlift.svg'
import exerciseImage17 from '@/assets/exercises/calf-raise.svg'
import exerciseImage18 from '@/assets/exercises/plank.svg'
import exerciseImage19 from '@/assets/exercises/crunch.svg'
import exerciseImage20 from '@/assets/exercises/push-up.svg'
import type { Exercise } from '@/types/exercise'

export const exercises: Exercise[] = [
  {
    id: 1, name: 'Bankdrücken', muscleGroup: 'Brust', equipment: 'Langhantel und Flachbank',
    image: exerciseImage1,
    description: 'Horizontale Druckübung für Brust, Trizeps und vordere Schulter.',
    execution: ['Auf die Bank legen und die Füße fest aufstellen.', 'Die Stange kontrolliert zur Brust absenken.', 'Die Stange gleichmäßig nach oben drücken.'],
    alternatives: [2, 3, 20],
  },
  {
    id: 2, name: 'Kurzhantel-Bankdrücken', muscleGroup: 'Brust', equipment: 'Kurzhanteln und Flachbank',
    image: exerciseImage2,
    description: 'Brustübung mit unabhängig geführten Hanteln.',
    execution: ['Mit den Hanteln auf die Bank legen.', 'Die Hanteln seitlich auf Brusthöhe absenken.', 'Beide Hanteln kontrolliert nach oben drücken.'],
    alternatives: [1, 3, 20],
  },
  {
    id: 3, name: 'Brustpresse', muscleGroup: 'Brust', equipment: 'Brustpressmaschine',
    image: exerciseImage3,
    description: 'Geführte Druckbewegung für die Brustmuskulatur.',
    execution: ['Den Sitz so einstellen, dass die Griffe auf Brusthöhe liegen.', 'Den Rücken anlehnen und die Griffe nach vorne drücken.', 'Die Griffe langsam zurückführen.'],
    alternatives: [1, 2, 20],
  },
  {
    id: 4, name: 'Kabelzug Flys', muscleGroup: 'Brust', equipment: 'Doppelter Kabelzug',
    image: exerciseImage4,
    description: 'Zusammenführen der Arme gegen Kabelwiderstand für die Brust.',
    execution: ['Die Griffe im stabilen Schrittstand aufnehmen.', 'Die leicht gebeugten Arme vor dem Körper zusammenführen.', 'Die Arme kontrolliert wieder öffnen.'],
    alternatives: [3, 2],
  },
  {
    id: 5, name: 'Schulterdrücken', muscleGroup: 'Schultern', equipment: 'Kurzhanteln',
    image: exerciseImage5,
    description: 'Vertikale Druckübung für Schultern und Trizeps.',
    execution: ['Die Hanteln auf Schulterhöhe halten.', 'Mit angespanntem Rumpf über den Kopf drücken.', 'Die Hanteln langsam auf Schulterhöhe absenken.'],
    alternatives: [6],
  },
  {
    id: 6, name: 'Seitheben', muscleGroup: 'Schultern', equipment: 'Kurzhanteln',
    image: exerciseImage6,
    description: 'Isolationsübung mit Schwerpunkt auf der seitlichen Schulter.',
    execution: ['Aufrecht stehen und die Hanteln neben dem Körper halten.', 'Die leicht gebeugten Arme seitlich bis etwa Schulterhöhe heben.', 'Die Hanteln ohne Schwung absenken.'],
    alternatives: [5],
  },
  {
    id: 7, name: 'Klimmzüge', muscleGroup: 'Rücken', equipment: 'Klimmzugstange',
    image: exerciseImage7,
    description: 'Vertikale Zugübung mit dem eigenen Körpergewicht.',
    execution: ['Die Stange etwas breiter als schulterbreit greifen.', 'Den Körper ohne Schwung zur Stange ziehen.', 'Langsam wieder in die Ausgangsposition absenken.'],
    alternatives: [8, 9],
  },
  {
    id: 8, name: 'Latziehen', muscleGroup: 'Rücken', equipment: 'Latzugmaschine',
    image: exerciseImage8,
    description: 'Geführte Zugübung für den breiten Rückenmuskel.',
    execution: ['Die Oberschenkel unter den Polstern fixieren.', 'Die Stange vor dem Körper zur oberen Brust ziehen.', 'Die Arme kontrolliert wieder nach oben strecken.'],
    alternatives: [7, 9],
  },
  {
    id: 9, name: 'Rudern am Kabelzug', muscleGroup: 'Rücken', equipment: 'Kabelzug mit Rudergriff',
    image: exerciseImage9,
    description: 'Horizontale Zugübung für den mittleren und oberen Rücken.',
    execution: ['Aufrecht sitzen und die Füße stabil abstützen.', 'Den Griff zum Bauch ziehen und die Schulterblätter zusammenführen.', 'Die Arme langsam nach vorne führen.'],
    alternatives: [8, 7],
  },
  {
    id: 10, name: 'Bizeps Curls', muscleGroup: 'Bizeps', equipment: 'Kurzhanteln',
    image: exerciseImage10,
    description: 'Beugen der Ellenbogen gegen Widerstand für den Bizeps.',
    execution: ['Die Hanteln mit nach vorne gerichteten Handflächen halten.', 'Die Ellenbogen am Körper lassen und die Hanteln anheben.', 'Die Hanteln kontrolliert absenken.'],
    alternatives: [7, 8],
  },
  {
    id: 11, name: 'Trizeps Pushdown', muscleGroup: 'Trizeps', equipment: 'Kabelzug mit Seil',
    image: exerciseImage11,
    description: 'Streckbewegung am Kabelzug für die Oberarmrückseite.',
    execution: ['Das Seil greifen und die Ellenbogen am Körper halten.', 'Die Unterarme nach unten strecken.', 'Das Seil langsam zurückführen, ohne die Oberarme zu bewegen.'],
    alternatives: [20, 3],
  },
  {
    id: 12, name: 'Kniebeugen', muscleGroup: 'Oberschenkel und Gesäß', equipment: 'Langhantel und Rack',
    image: exerciseImage12,
    description: 'Mehrgelenkige Beinübung mit zusätzlicher Rumpfstabilisation.',
    execution: ['Die Stange auf dem oberen Rücken positionieren und stabil stehen.', 'Hüfte und Knie beugen und den Oberkörper stabil halten.', 'Über den ganzen Fuß wieder aufrichten.'],
    alternatives: [13, 14],
  },
  {
    id: 13, name: 'Beinpresse', muscleGroup: 'Oberschenkel und Gesäß', equipment: 'Beinpressmaschine',
    image: exerciseImage13,
    description: 'Geführte Streckbewegung für die Beinmuskulatur.',
    execution: ['Die Füße etwa schulterbreit auf die Plattform setzen.', 'Die Knie beugen, während das Becken am Polster bleibt.', 'Die Plattform kontrolliert wegdrücken.'],
    alternatives: [12, 14],
  },
  {
    id: 14, name: 'Beinstrecker', muscleGroup: 'Vordere Oberschenkel', equipment: 'Beinstreckmaschine',
    image: exerciseImage14,
    description: 'Isolationsübung für den Quadrizeps.',
    execution: ['Die Maschine passend zur Knieachse einstellen.', 'Die Beine gegen das Polster strecken.', 'Das Gewicht langsam wieder absenken.'],
    alternatives: [13, 12],
  },
  {
    id: 15, name: 'Beinbeuger', muscleGroup: 'Hintere Oberschenkel', equipment: 'Beinbeugemaschine',
    image: exerciseImage15,
    description: 'Beugen der Knie gegen Widerstand für die Oberschenkelrückseite.',
    execution: ['Sitz und Polster passend zur Beinlänge einstellen.', 'Die Knie beugen und das Polster nach hinten unten ziehen.', 'Die Beine kontrolliert wieder strecken.'],
    alternatives: [16],
  },
  {
    id: 16, name: 'Romanian Deadlift', muscleGroup: 'Hintere Oberschenkel und Gesäß', equipment: 'Langhantel',
    image: exerciseImage16,
    description: 'Hüftdominante Hebebewegung für die hintere Muskelkette.',
    execution: ['Aufrecht stehen und die Hantel vor den Oberschenkeln halten.', 'Die Hüfte bei leicht gebeugten Knien nach hinten schieben.', 'Die Hüfte wieder strecken und aufrichten.'],
    alternatives: [15],
  },
  {
    id: 17, name: 'Wadenheben', muscleGroup: 'Waden', equipment: 'Wadenmaschine oder Körpergewicht',
    image: exerciseImage17,
    description: 'Anheben der Fersen zur Kräftigung der Waden.',
    execution: ['Die Fußballen stabil auf der Plattform positionieren.', 'Die Fersen möglichst weit anheben.', 'Die Fersen kontrolliert wieder absenken.'],
    alternatives: [],
  },
  {
    id: 18, name: 'Plank', muscleGroup: 'Rumpf', equipment: 'Trainingsmatte',
    image: exerciseImage18,
    description: 'Statische Rumpfübung im Unterarmstütz.',
    execution: ['Die Unterarme unter den Schultern aufsetzen.', 'Den Körper auf Unterarmen und Zehenspitzen in einer Linie halten.', 'Ruhig weiteratmen und die Spannung während der Haltezeit bewahren.'],
    alternatives: [19],
  },
  {
    id: 19, name: 'Crunches', muscleGroup: 'Bauch', equipment: 'Trainingsmatte',
    image: exerciseImage19,
    description: 'Kontrolliertes Einrollen des Oberkörpers für die Bauchmuskeln.',
    execution: ['Auf den Rücken legen und die Beine anstellen.', 'Den oberen Rücken durch Anspannen des Bauchs leicht anheben.', 'Langsam wieder zur Matte absenken.'],
    alternatives: [18],
  },
  {
    id: 20, name: 'Liegestütze', muscleGroup: 'Brust und Trizeps', equipment: 'Körpergewicht',
    image: exerciseImage20,
    description: 'Horizontale Druckübung im Stütz mit dem eigenen Körpergewicht.',
    execution: ['Die Hände etwas breiter als schulterbreit aufsetzen.', 'Den Körper als gerade Linie kontrolliert zum Boden absenken.', 'Über die Hände wieder nach oben drücken.'],
    alternatives: [1, 2, 3],
  },
]
