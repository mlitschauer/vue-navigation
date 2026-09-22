<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Exercise } from '@/types/exercise'

defineProps<{
  exercise: Exercise
}>()
</script>

<template>
  <article class="exercise-card">
    <h2>{{ exercise.name }}</h2>
    <dl class="exercise-card__details">
      <div>
        <dt>Muskelgruppe</dt>
        <dd>{{ exercise.muscleGroup }}</dd>
      </div>
      <div>
        <dt>Equipment</dt>
        <dd>{{ exercise.equipment }}</dd>
      </div>
    </dl>
    <RouterLink
      class="exercise-card__link"
      :to="{ name: 'exercise-detail', params: { id: exercise.id } }"
    >
      Übung ansehen <span aria-hidden="true">→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.exercise-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
  overflow-wrap: anywhere;
}

.exercise-card h2,
.exercise-card__details,
.exercise-card__details div,
.exercise-card__details dt,
.exercise-card__details dd {
  margin: 0;
}

.exercise-card__details {
  display: grid;
  gap: 0.75rem;
}

.exercise-card__details div {
  display: grid;
  gap: 0.25rem;
}

.exercise-card__details dt {
  color: #555;
  font-size: 0.875rem;
}

.exercise-card__link {
  justify-self: start;
  padding: 0.5rem 0.75rem;
  color: #fff;
  background: #333;
  border-radius: 0.25rem;
  font-weight: 600;
  text-decoration: none;
}

.exercise-card__link:hover,
.exercise-card__link:focus-visible {
  background: #555;
}
</style>
