<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ExerciseSelector from '@/components/ExerciseSelector.vue'
import TrainingExerciseEditor from '@/components/TrainingExerciseEditor.vue'
import { getExerciseById } from '@/utils/data'
import { validateTraining } from '@/utils/trainingValidation'
import { trainingTypes } from '@/types/training'
import type { TrainingDraft } from '@/types/training'

defineProps<{ saving: boolean; saveError: string }>()
const emit = defineEmits<{ submit: [draft: TrainingDraft] }>()
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const draft = ref<TrainingDraft>({ date: today, type: '', duration: '', exercises: [] })
const submitted = ref(false)
const form = ref<HTMLFormElement>()
const errors = computed(() => submitted.value ? validateTraining(draft.value) : {})
function addExercise(id: number): void {
  if (getExerciseById(id) && !draft.value.exercises.some((entry) => entry.exerciseId === id)) {
    draft.value.exercises.push({ exerciseId: id, sets: [{ weight: '', reps: '' }] })
  }
}
function moveExercise(index: number, direction: -1 | 1): void {
  const target = index + direction
  if (target < 0 || target >= draft.value.exercises.length) return
  const [entry] = draft.value.exercises.splice(index, 1)
  draft.value.exercises.splice(target, 0, entry)
}
async function submit(): Promise<void> {
  submitted.value = true
  if (Object.keys(errors.value).length) {
    await nextTick()
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  emit('submit', draft.value)
}
</script>

<template>
  <form ref="form" class="training-form" novalidate @submit.prevent="submit">
    <fieldset :disabled="saving" class="training-form__fields">
      <legend class="visually-hidden">Trainingsdaten</legend>
      <section class="form-panel" aria-labelledby="basic-data-title">
        <h2 id="basic-data-title">Grunddaten</h2>
        <div class="form-grid">
          <label class="form-field">Datum
            <input v-model="draft.date" type="date" required :aria-invalid="!!errors.date" :aria-describedby="errors.date ? 'date-error' : undefined">
            <span v-if="errors.date" id="date-error" class="field-error">{{ errors.date }}</span>
          </label>
          <label class="form-field">Trainingsart
            <select v-model="draft.type" required :aria-invalid="!!errors.type" :aria-describedby="errors.type ? 'type-error' : undefined">
              <option value="">Bitte auswählen</option>
              <option v-for="type in trainingTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <span v-if="errors.type" id="type-error" class="field-error">{{ errors.type }}</span>
          </label>
          <label class="form-field">Dauer (Minuten)
            <input v-model.number="draft.duration" type="number" inputmode="decimal" min="0" step="any" required :aria-invalid="!!errors.duration" :aria-describedby="errors.duration ? 'duration-error' : undefined">
            <span v-if="errors.duration" id="duration-error" class="field-error">{{ errors.duration }}</span>
          </label>
        </div>
      </section>
      <section class="form-panel" aria-labelledby="selection-title">
        <h2 id="selection-title">Übungen auswählen</h2>
        <ExerciseSelector :selected-ids="draft.exercises.map((entry) => entry.exerciseId)" @add="addExercise" />
        <p v-if="errors.exercises" class="field-error">{{ errors.exercises }}</p>
      </section>
      <p>Gewicht in kg, bei Kurzhanteln pro Hantel. Ohne Zusatzgewicht: 0 kg.</p>
      <TrainingExerciseEditor v-for="(entry, index) in draft.exercises" :key="entry.exerciseId"
        v-model="draft.exercises[index]" :index="index" :count="draft.exercises.length" :errors="errors"
        @remove="draft.exercises.splice(index, 1)" @move="moveExercise(index, $event)" />
      <p v-if="Object.keys(errors).length" class="field-error" role="alert">Bitte die markierten Angaben vervollständigen oder korrigieren.</p>
      <p v-if="saveError" class="field-error" role="alert">{{ saveError }}</p>
      <div class="form-actions">
        <button type="submit" class="btn">{{ saving ? 'Wird gespeichert …' : 'Training speichern' }}</button>
        <RouterLink class="btn btn--secondary" :to="{ name: 'trainings' }">Abbrechen</RouterLink>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.training-form__fields { display: grid; gap: var(--space-6); min-width: 0; border: 0; padding: 0; margin: 0; }
.form-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
@media (max-width: 40rem) { .form-grid { grid-template-columns: 1fr; } }
</style>
