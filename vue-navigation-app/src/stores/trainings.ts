import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { trainings as syntheticTrainings } from '@/data/trainings'
import type { Training, TrainingDraft } from '@/types/training'
import { isTraining, validateTraining } from '@/utils/trainingValidation'

export const TRAININGS_STORAGE_KEY = 'insight-fitness.trainings.v1'

export const useTrainingsStore = defineStore('trainings', () => {
  const savedTrainings = ref<Training[]>([])
  const storageWarning = ref('')
  const trainings = computed(() => [...syntheticTrainings, ...savedTrainings.value])

  function readSavedTrainings(): Training[] {
    const raw = localStorage.getItem(TRAININGS_STORAGE_KEY)
    if (raw === null) return []
    let data: unknown
    try { data = JSON.parse(raw) } catch {
      storageWarning.value = 'Beschädigte gespeicherte Trainings wurden ignoriert.'
      return []
    }
    if (!Array.isArray(data)) {
      storageWarning.value = 'Das Format der gespeicherten Trainings ist ungültig.'
      return []
    }
    const ids = new Set(syntheticTrainings.map((training) => training.id))
    return data.filter((value: unknown): value is Training => {
      if (!isTraining(value) || ids.has(value.id)) {
        storageWarning.value = 'Ungültige oder doppelte gespeicherte Trainings wurden ignoriert.'
        return false
      }
      ids.add(value.id)
      return true
    })
  }

  function loadTrainings(): void {
    storageWarning.value = ''
    try { savedTrainings.value = readSavedTrainings() } catch {
      storageWarning.value = 'Der Browserspeicher ist nicht verfügbar. Speichern ist derzeit nicht möglich.'
    }
  }

  async function createTraining(draft: TrainingDraft): Promise<Training> {
    const errors = validateTraining(draft)
    if (Object.keys(errors).length) throw new Error('Bitte die markierten Angaben prüfen.')
    // Snapshot vor einem möglichen Warten auf die tabübergreifende Schreibsperre.
    const snapshot: unknown = JSON.parse(JSON.stringify(draft))
    const save = (): Training => {
      let latest: Training[]
      try { latest = readSavedTrainings() } catch {
        throw new Error('Der Browserspeicher ist nicht verfügbar. Deine Eingaben bleiben im Formular.')
      }
      const highestId = [...syntheticTrainings, ...savedTrainings.value, ...latest]
        .reduce((highest, training) => Math.max(highest, training.id), 0)
      if (!Number.isSafeInteger(highestId + 1)) throw new Error('Es kann keine weitere Trainings-ID vergeben werden.')
      const training = { ...(typeof snapshot === 'object' && snapshot !== null ? snapshot : {}), id: highestId + 1 }
      if (!isTraining(training)) throw new Error('Das Training enthält ungültige Angaben.')
      const next = [...latest, training]
      try { localStorage.setItem(TRAININGS_STORAGE_KEY, JSON.stringify(next)) } catch {
        throw new Error('Speichern fehlgeschlagen. Bitte freien Browserspeicher und Speicherberechtigungen prüfen. Deine Eingaben bleiben erhalten.')
      }
      savedTrainings.value = next
      storageWarning.value = ''
      return training
    }
    // Verhindert auch Kollisionen bei gleichzeitigem Speichern in mehreren Tabs.
    if (typeof navigator !== 'undefined' && navigator.locks) {
      return navigator.locks.request(TRAININGS_STORAGE_KEY, save)
    }
    return save()
  }

  function getTrainingById(id: number): Training | undefined {
    return trainings.value.find((training) => training.id === id)
  }

  loadTrainings()
  return { trainings, storageWarning, loadTrainings, createTraining, getTrainingById }
})
