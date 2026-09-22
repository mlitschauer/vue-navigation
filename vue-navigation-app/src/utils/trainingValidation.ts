import { exercises } from '@/data/exercises'
import { trainingTypes } from '@/types/training'
import type { Training } from '@/types/training'

export type ValidationErrors = Record<string, string>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function finiteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

// Dieselben Regeln gelten für das Formular und für nicht vertrauenswürdige Browserdaten.
export function validateTraining(value: unknown): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!isRecord(value)) return { training: 'Ungültiges Training.' }
  if (!isValidDate(value.date)) errors.date = 'Bitte ein gültiges Datum eingeben.'
  if (!trainingTypes.some((type) => type === value.type)) errors.type = 'Bitte eine Trainingsart auswählen.'
  if (!finiteNumber(value.duration) || value.duration <= 0) errors.duration = 'Die Dauer muss größer als 0 Minuten sein.'
  if (!Array.isArray(value.exercises) || !value.exercises.length) {
    errors.exercises = 'Bitte mindestens eine Übung hinzufügen.'
    return errors
  }
  const selectedIds = new Set<number>()
  value.exercises.forEach((entry: unknown, index: number) => {
    const path = `exercises.${index}`
    if (!isRecord(entry)) { errors[path] = 'Ungültige Übung.'; return }
    if (typeof entry.exerciseId !== 'number' || !exercises.some((exercise) => exercise.id === entry.exerciseId)) {
      errors[path] = 'Diese Übung ist nicht im Katalog vorhanden.'
    } else if (selectedIds.has(entry.exerciseId)) {
      errors[path] = 'Eine Übung darf nur einmal hinzugefügt werden.'
    } else selectedIds.add(entry.exerciseId)
    if (!Array.isArray(entry.sets) || !entry.sets.length) {
      errors[`${path}.sets`] = 'Bitte mindestens einen gültigen Satz hinzufügen.'
      return
    }
    entry.sets.forEach((set: unknown, setIndex: number) => {
      const setPath = `${path}.sets.${setIndex}`
      if (!isRecord(set) || !finiteNumber(set.weight) || set.weight < 0) {
        errors[`${setPath}.weight`] = 'Bitte ein Gewicht ab 0 kg eingeben.'
      }
      if (!isRecord(set) || !finiteNumber(set.reps) || !Number.isSafeInteger(set.reps) || set.reps <= 0) {
        errors[`${setPath}.reps`] = 'Bitte eine ganze Zahl größer als 0 eingeben.'
      }
    })
  })
  return errors
}

export function isTraining(value: unknown): value is Training {
  return isRecord(value) && typeof value.id === 'number' && Number.isSafeInteger(value.id)
    && value.id > 0 && Object.keys(validateTraining(value)).length === 0
}
