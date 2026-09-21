<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TrainingExerciseList from '@/components/TrainingExerciseList.vue'
import TrainingStats from '@/components/TrainingStats.vue'
import { getTrainingById } from '@/utils/data'

const route = useRoute()
const training = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? getTrainingById(id) : undefined
})
</script>

<template>
  <h1>Training Detail</h1>
  <template v-if="training">
    <dl>
      <dt>Trainingsart</dt>
      <dd>{{ training.type }}</dd>
      <dt>Datum</dt>
      <dd><time :datetime="training.date">{{ training.date }}</time></dd>
      <dt>Dauer</dt>
      <dd>{{ training.duration }} Minuten</dd>
      <dt>Anzahl der Übungen</dt>
      <dd>{{ training.exercises.length }}</dd>
    </dl>
    <TrainingStats :training="training" />
    <TrainingExerciseList :training="training" />
  </template>
  <p v-else>Training nicht gefunden.</p>
</template>
