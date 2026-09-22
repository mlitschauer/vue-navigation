<script setup lang="ts">
import { computed, ref } from 'vue'
import ExerciseCard from '@/components/ExerciseCard.vue'
import ExerciseFilter from '@/components/ExerciseFilter.vue'
import { exercises } from '@/data/exercises'

const searchTerm = ref('')
const selectedMuscleGroup = ref('all')
const selectedEquipment = ref('all')

const muscleGroups = computed(() => [...new Set(
  exercises.map((exercise) => exercise.muscleGroup),
)].sort())

const equipmentOptions = computed(() => [...new Set(
  exercises.map((exercise) => exercise.equipment),
)].sort())

const filteredExercises = computed(() => {
  const normalizedSearchTerm = searchTerm.value.trim().toLocaleLowerCase()

  return exercises.filter((exercise) => (
    exercise.name.toLocaleLowerCase().includes(normalizedSearchTerm)
    && (selectedMuscleGroup.value === 'all' || exercise.muscleGroup === selectedMuscleGroup.value)
    && (selectedEquipment.value === 'all' || exercise.equipment === selectedEquipment.value)
  ))
})

function resetFilters(): void {
  searchTerm.value = ''
  selectedMuscleGroup.value = 'all'
  selectedEquipment.value = 'all'
}
</script>

<template>
  <section class="exercises-view">
    <header class="exercises-view__header">
      <h1>Übungsübersicht</h1>
      <p>Alle verfügbaren Übungen</p>
    </header>

    <section class="exercises-view__filters" aria-label="Übungen filtern">
      <ExerciseFilter
        v-model:search-term="searchTerm"
        v-model:selected-muscle-group="selectedMuscleGroup"
        v-model:selected-equipment="selectedEquipment"
        :muscle-groups="muscleGroups"
        :equipment-options="equipmentOptions"
        @reset="resetFilters"
      />
    </section>

    <section aria-labelledby="exercise-list-title">
      <h2 id="exercise-list-title" class="visually-hidden">Übungen</h2>
      <div v-if="filteredExercises.length" class="card-grid">
        <ExerciseCard
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          :exercise="exercise"
        />
      </div>
      <div v-else-if="exercises.length === 0" class="empty-state">
        <p>Noch keine Übungen vorhanden.</p>
        <p>Sobald Übungen vorhanden sind, erscheinen sie hier.</p>
      </div>
      <div v-else class="empty-state">
        <p>Keine Übungen gefunden.</p>
        <p>Versuche einen anderen Suchbegriff oder Filter.</p>
      </div>
    </section>
  </section>
</template>

<style scoped>
.exercises-view {
  max-width: 72rem;
  margin-inline: auto;
  padding: 1.5rem;
}

.exercises-view__header {
  margin-bottom: 1.5rem;
}

.exercises-view__filters {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.exercises-view__header h1,
.exercises-view__header p,
.empty-state p {
  margin: 0;
}

.exercises-view__header p {
  margin-top: 0.5rem;
  color: #555;
}

.empty-state {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.empty-state p + p {
  margin-top: 0.5rem;
  color: #555;
}

@media (max-width: 40rem) {
  .exercises-view {
    padding: 1rem;
  }
}
</style>
