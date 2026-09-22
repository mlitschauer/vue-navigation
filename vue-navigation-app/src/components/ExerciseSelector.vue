<script setup lang="ts">
import { computed, ref } from 'vue'
import { exercises } from '@/data/exercises'
import ExerciseImage from '@/components/ExerciseImage.vue'

const props = defineProps<{ selectedIds: number[] }>()
const emit = defineEmits<{ add: [id: number] }>()
const search = ref('')
const selectedId = ref('')
const available = computed(() => exercises.filter((exercise) => !props.selectedIds.includes(exercise.id)
  && `${exercise.name} ${exercise.muscleGroup} ${exercise.equipment}`.toLocaleLowerCase('de').includes(search.value.trim().toLocaleLowerCase('de'))))
const selected = computed(() => available.value.find((exercise) => exercise.id === Number(selectedId.value)))
function add(): void {
  if (!selected.value) return
  emit('add', selected.value.id)
  selectedId.value = ''
}
</script>

<template>
  <div class="exercise-selector">
    <label class="form-field">Übung suchen
      <input v-model="search" type="search" placeholder="Name, Muskelgruppe oder Equipment">
    </label>
    <label class="form-field">Übung auswählen
      <select v-model="selectedId">
        <option value="">Bitte auswählen</option>
        <option v-for="exercise in available" :key="exercise.id" :value="String(exercise.id)">
          {{ exercise.name }} · {{ exercise.muscleGroup }}
        </option>
      </select>
    </label>
    <div v-if="selected" class="exercise-selector__preview">
      <ExerciseImage :exercise="selected" compact />
      <span>{{ selected.equipment }}</span>
    </div>
    <p v-if="!available.length">Keine weiteren passenden Übungen gefunden.</p>
    <button type="button" class="btn" :disabled="!selected" @click="add">Übung hinzufügen</button>
  </div>
</template>

<style scoped>
.exercise-selector { display: grid; gap: var(--space-4); }
.exercise-selector .btn { justify-self: start; }
.exercise-selector__preview { display: flex; align-items: center; gap: var(--space-4); }
.exercise-selector__preview .exercise-image { width: 7rem; flex-shrink: 0; }
</style>
