export interface TrainingSet {
  /** Gewicht in kg; 0 steht für Training ohne Zusatzgewicht. */
  weight: number
  reps: number
}

export interface TrainingExercise {
  exerciseId: number
  sets: TrainingSet[]
}

export interface Training {
  id: number
  /** Datum im Format YYYY-MM-DD. */
  date: string
  type: string
  /** Dauer in Minuten. */
  duration: number
  exercises: TrainingExercise[]
}

export const trainingTypes = ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body', 'Full Body', 'Sonstiges'] as const

// Nur leere Formularfelder ergänzen das vorhandene Modell; gespeichert wird Training.
export type TrainingSetDraft = { [Key in keyof TrainingSet]: TrainingSet[Key] | '' }
export type TrainingExerciseDraft = Omit<TrainingExercise, 'sets'> & { sets: TrainingSetDraft[] }
export type TrainingDraft = Omit<Training, 'id' | 'duration' | 'exercises'> & {
  duration: Training['duration'] | ''
  exercises: TrainingExerciseDraft[]
}
