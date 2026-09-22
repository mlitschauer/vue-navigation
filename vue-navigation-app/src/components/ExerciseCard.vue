<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import ExerciseImage from '@/components/ExerciseImage.vue'
import type { Exercise } from '@/types/exercise'
defineProps<{ exercise: Exercise }>()
</script>

<template>
  <article class="card">
    <ExerciseImage :exercise="exercise" compact />
    <h3 class="card__title">{{ exercise.name }}</h3>
    <ul class="card__meta">
      <li class="card__meta-item"><AppIcon name="muscle" /> {{ exercise.muscleGroup }}</li>
      <li class="card__meta-item"><AppIcon name="equipment" /> {{ exercise.equipment }}</li>
    </ul>
    <RouterLink class="card__link" :to="{ name: 'exercise-detail', params: { id: exercise.id } }">
      <span class="card__link-text">Details</span>
      <AppIcon class="card__link-arrow" name="arrow" :size="16" :stroke-width="1.5" />
    </RouterLink>
  </article>
</template>

<style scoped>
.card { min-width: 0; overflow-wrap: anywhere; }
</style>
