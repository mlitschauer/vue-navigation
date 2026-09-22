<script setup lang="ts">
import { computed } from 'vue'
import { getExerciseById } from '@/utils/data'
import type { TrainingExerciseDraft, TrainingSetDraft } from '@/types/training'
import type { ValidationErrors } from '@/utils/trainingValidation'

const entry = defineModel<TrainingExerciseDraft>({ required: true })
const props = defineProps<{ index: number; count: number; errors: ValidationErrors }>()
defineEmits<{ remove: []; move: [direction: -1 | 1] }>()
const exercise = computed(() => getExerciseById(entry.value.exerciseId))
const path = computed(() => `exercises.${props.index}`)
const fieldId = (setIndex: number, field: keyof TrainingSetDraft) => `exercise-${entry.value.exerciseId}-set-${setIndex}-${field}`
const error = (setIndex: number, field: keyof TrainingSetDraft) => props.errors[`${path.value}.sets.${setIndex}.${field}`]
function addSet(): void { entry.value.sets.push({ weight: '', reps: '' }) }
</script>

<template>
  <section class="form-panel exercise-editor" :aria-label="exercise?.name">
    <header class="exercise-editor__header">
      <div><h3>{{ index + 1 }}. {{ exercise?.name ?? 'Unbekannte Übung' }}</h3>
        <p>{{ exercise?.muscleGroup }} · {{ exercise?.equipment }}</p>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--secondary btn--small" :disabled="index === 0" :aria-label="`${exercise?.name} nach oben`" @click="$emit('move', -1)">↑</button>
        <button type="button" class="btn btn--secondary btn--small" :disabled="index === count - 1" :aria-label="`${exercise?.name} nach unten`" @click="$emit('move', 1)">↓</button>
        <button type="button" class="btn btn--secondary btn--small" @click="$emit('remove')">Übung entfernen</button>
      </div>
    </header>
    <p v-if="errors[path]" class="field-error">{{ errors[path] }}</p>
    <div v-for="(set, setIndex) in entry.sets" :key="setIndex" class="set-row">
      <strong>Satz {{ setIndex + 1 }}</strong>
      <label class="form-field" :for="fieldId(setIndex, 'weight')">Gewicht (kg)
        <input :id="fieldId(setIndex, 'weight')" v-model.number="set.weight" type="number" inputmode="decimal" min="0" step="any" required
          :aria-invalid="!!error(setIndex, 'weight')" :aria-describedby="error(setIndex, 'weight') ? `${fieldId(setIndex, 'weight')}-error` : undefined">
        <span v-if="error(setIndex, 'weight')" :id="`${fieldId(setIndex, 'weight')}-error`" class="field-error">{{ error(setIndex, 'weight') }}</span>
      </label>
      <label class="form-field" :for="fieldId(setIndex, 'reps')">Wiederholungen
        <input :id="fieldId(setIndex, 'reps')" v-model.number="set.reps" type="number" inputmode="numeric" min="1" step="1" required
          :aria-invalid="!!error(setIndex, 'reps')" :aria-describedby="error(setIndex, 'reps') ? `${fieldId(setIndex, 'reps')}-error` : undefined">
        <span v-if="error(setIndex, 'reps')" :id="`${fieldId(setIndex, 'reps')}-error`" class="field-error">{{ error(setIndex, 'reps') }}</span>
      </label>
      <button type="button" class="btn btn--secondary btn--small" :aria-label="`Satz ${setIndex + 1} entfernen`" @click="entry.sets.splice(setIndex, 1)">Satz entfernen</button>
    </div>
    <p v-if="errors[`${path}.sets`]" class="field-error">{{ errors[`${path}.sets`] }}</p>
    <button type="button" class="btn btn--secondary" @click="addSet">Satz hinzufügen</button>
  </section>
</template>

<style scoped>
.exercise-editor { display: grid; gap: var(--space-4); }
.exercise-editor__header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); }
.exercise-editor__header h3, .exercise-editor__header p { margin: 0; }
.exercise-editor__header p { color: var(--color-text-muted); }
.exercise-editor > .btn { justify-self: start; }
.set-row { display: grid; grid-template-columns: 4rem minmax(0, 1fr) minmax(0, 1fr) auto; gap: var(--space-3); align-items: start; padding-block: var(--space-3); border-bottom: 1px solid var(--color-border); }
@media (max-width: 48rem) {
  .set-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .set-row > strong { grid-column: 1 / -1; }
  .set-row > button { grid-column: 1 / -1; justify-self: start; }
}
</style>
