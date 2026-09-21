<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getExerciseById } from '@/utils/data'
import type { Training } from '@/types/training'

const props = defineProps<{
  training: Training
}>()

const exerciseEntries = computed(() => props.training.exercises.map((trainingExercise, index) => ({
  number: index + 1,
  trainingExercise,
  exercise: getExerciseById(trainingExercise.exerciseId),
})))

</script>

<template>
  <section class="training-exercise-list" aria-labelledby="exercise-list-title">
    <h2 id="exercise-list-title">Übungen</h2>

    <div v-if="exerciseEntries.length" class="training-exercise-list__items">
      <article
        v-for="entry in exerciseEntries"
        :key="`${entry.number}-${entry.trainingExercise.exerciseId}`"
        class="exercise-card"
      >
        <header class="exercise-card__header">
          <p class="exercise-card__number">{{ String(entry.number).padStart(2, '0') }}</p>
          <div>
            <template v-if="entry.exercise">
              <h3>{{ entry.exercise.name }}</h3>
              <p class="exercise-card__details">
                {{ entry.exercise.muscleGroup }} · {{ entry.exercise.equipment }}
              </p>
            </template>
            <p v-else class="exercise-card__unavailable">Übung nicht verfügbar.</p>
          </div>
        </header>

        <ol v-if="entry.trainingExercise.sets.length" class="exercise-card__sets">
          <li
            v-for="(set, setIndex) in entry.trainingExercise.sets"
            :key="`${entry.number}-${setIndex}`"
          >
            <span>Set {{ setIndex + 1 }}</span>
            <span>{{ set.weight }} kg × {{ set.reps }}</span>
          </li>
        </ol>
        <p v-else class="exercise-card__no-sets">Keine Sets absolviert.</p>

        <RouterLink
          v-if="entry.exercise"
          class="exercise-card__link"
          :to="{ name: 'exercise-detail', params: { id: entry.exercise.id } }"
        >
          Übung ansehen <span aria-hidden="true">→</span>
        </RouterLink>
      </article>
    </div>
    <p v-else>Keine Übungen für dieses Training vorhanden.</p>
  </section>
</template>

<style scoped>
.training-exercise-list {
  margin-block: 1.5rem;
}

.training-exercise-list__items {
  display: grid;
  gap: 1rem;
}

.exercise-card {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow-wrap: anywhere;
}

.exercise-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
}

.exercise-card__header h3,
.exercise-card__details,
.exercise-card__number,
.exercise-card__unavailable,
.exercise-card__no-sets {
  margin: 0;
}

.exercise-card__number {
  color: #555;
  font-weight: 700;
}

.exercise-card__details,
.exercise-card__no-sets {
  margin-top: 0.25rem;
  color: #555;
}

.exercise-card__unavailable {
  font-weight: 600;
}

.exercise-card__sets {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.exercise-card__sets li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.5rem;
  border-bottom: 1px solid #eee;
}

.exercise-card__link {
  justify-self: start;
  color: #333;
  font-weight: 600;
}

@media (max-width: 30rem) {
  .exercise-card__sets li {
    flex-direction: column;
    gap: 0.125rem;
  }
}
</style>
