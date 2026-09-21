<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Training } from '@/types/training'

defineProps<{
  training: Training
}>()
</script>

<template>
  <article class="training-card">
    <p class="training-card__type">{{ training.type }}</p>
    <time class="training-card__date" :datetime="training.date">
      {{ training.date }}
    </time>
    <p class="training-card__meta">
      {{ training.duration }} Minuten · {{ training.exercises.length }} Übungen
    </p>
    <RouterLink
      class="training-card__link"
      :to="{ name: 'training-detail', params: { id: training.id } }"
    >
      Training ansehen <span aria-hidden="true">→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.training-card {
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
}

.training-card__type {
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.training-card__date,
.training-card__meta {
  margin: 0;
}

.training-card__meta {
  color: #555;
}

.training-card__link {
  justify-self: start;
  padding: 0.5rem 0.75rem;
  color: #fff;
  background: #333;
  border-radius: 0.25rem;
  font-weight: 600;
  text-decoration: none;
}

.training-card__link:hover,
.training-card__link:focus-visible {
  background: #555;
}
</style>
