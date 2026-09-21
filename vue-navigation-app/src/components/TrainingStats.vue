<script setup lang="ts">
import { computed } from 'vue'
import type { Training } from '@/types/training'

const props = defineProps<{
  training: Training
}>()

const exerciseCount = computed(() => props.training.exercises.length)

const setCount = computed(() => props.training.exercises.reduce(
  (total, exercise) => total + exercise.sets.length,
  0,
))

const repetitionCount = computed(() => props.training.exercises.reduce(
  (total, exercise) => total + exercise.sets.reduce(
    (setTotal, set) => setTotal + set.reps,
    0,
  ),
  0,
))

const totalVolume = computed(() => props.training.exercises.reduce(
  (total, exercise) => total + exercise.sets.reduce(
    (setTotal, set) => setTotal + set.weight * set.reps,
    0,
  ),
  0,
))
</script>

<template>
  <section class="training-stats" aria-label="Trainingsstatistiken">
    <article class="training-stats__item">
      <strong>{{ training.duration }}</strong>
      <span>Minuten</span>
    </article>
    <article class="training-stats__item">
      <strong>{{ exerciseCount }}</strong>
      <span>Übungen</span>
    </article>
    <article class="training-stats__item">
      <strong>{{ setCount }}</strong>
      <span>Sets</span>
    </article>
    <article class="training-stats__item">
      <strong>{{ repetitionCount }}</strong>
      <span>Wiederholungen</span>
    </article>
    <article class="training-stats__item">
      <strong>{{ totalVolume }}</strong>
      <span>kg Gesamtvolumen</span>
    </article>
  </section>
</template>

<style scoped>
.training-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.75rem;
  margin-block: 1.5rem;
}

.training-stats__item {
  display: grid;
  gap: 0.25rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.training-stats__item strong {
  font-size: 1.5rem;
}

.training-stats__item span {
  color: #555;
}
</style>
