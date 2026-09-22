<script setup lang="ts">
import ExerciseCard from '@/components/ExerciseCard.vue'
import { exercises } from '@/data/exercises'
</script>

<template>
  <h1>Übungsübersicht</h1>
  <div class="card-grid">
    <ExerciseCard v-for="exercise in exercises" :key="exercise.id" :exercise="exercise" />
  </div>
</template>
