<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import type { Training } from '@/types/training'

defineProps<{ training: Training }>()

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <article class="card">
    <h3 class="card__title">{{ training.type }}</h3>
    <ul class="card__meta">
      <li class="card__meta-item">
        <AppIcon name="date" />
        <time :datetime="training.date">{{ formatDate(training.date) }}</time>
      </li>
      <li class="card__meta-item"><AppIcon name="duration" /> {{ training.duration }} Minuten</li>
      <li class="card__meta-item"><AppIcon name="exercises" /> {{ training.exercises.length }} Übungen</li>
    </ul>
    <RouterLink class="card__link" :to="{ name: 'training-detail', params: { id: training.id } }">
      <span class="card__link-text">Details</span>
      <AppIcon class="card__link-arrow" name="arrow" :size="16" :stroke-width="1.5" />
    </RouterLink>
  </article>
</template>
