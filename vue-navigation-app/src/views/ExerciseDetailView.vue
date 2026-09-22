<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ExerciseCard from '@/components/ExerciseCard.vue'
import { getExerciseAlternatives, getExerciseById } from '@/utils/data'

const route = useRoute()
const exercise = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? getExerciseById(id) : undefined
})

const alternatives = computed(() => (
  exercise.value ? getExerciseAlternatives(exercise.value) : []
))
</script>

<template>
  <main class="exercise-detail-view">
    <RouterLink class="exercise-detail-view__back-link" :to="{ name: 'exercises' }">
      ← Zurück zu Übungen
    </RouterLink>

    <template v-if="exercise">
    <h1>{{ exercise.name }}</h1>
    <dl>
      <dt>Muskelgruppe</dt>
      <dd>{{ exercise.muscleGroup }}</dd>
      <dt>Equipment</dt>
      <dd>{{ exercise.equipment }}</dd>
      <dt>Beschreibung</dt>
      <dd>{{ exercise.description }}</dd>
    </dl>

      <section class="exercise-detail-view__section" aria-labelledby="execution-title">
        <h2 id="execution-title">Ausführung</h2>
        <ol v-if="exercise.execution?.length" class="execution-steps">
          <li v-for="(step, index) in exercise.execution" :key="`${exercise.id}-${index}`">
            {{ step }}
          </li>
        </ol>
        <p v-else>Keine Ausführungsschritte vorhanden.</p>
      </section>

      <section class="exercise-detail-view__section" aria-labelledby="alternatives-title">
        <h2 id="alternatives-title">Alternative Übungen</h2>
        <div v-if="alternatives.length" class="alternative-grid">
          <ExerciseCard
            v-for="alternative in alternatives"
            :key="alternative.id"
            :exercise="alternative"
          />
        </div>
        <p v-else>Keine alternativen Übungen vorhanden.</p>
      </section>
    </template>
    <template v-else>
      <h1>Übung Detail</h1>
      <p>Übung nicht gefunden.</p>
    </template>
  </main>
</template>

<style scoped>
.exercise-detail-view {
  max-width: 72rem;
  margin-inline: auto;
  padding: 1.5rem;
}

.exercise-detail-view__back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #333;
}

.exercise-detail-view__section {
  margin-top: 1.5rem;
}

.execution-steps {
  display: grid;
  gap: 0.75rem;
  padding-left: 1.5rem;
}

.alternative-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 40.01rem) and (max-width: 56rem) {
  .alternative-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 40rem) {
  .exercise-detail-view {
    padding: 1rem;
  }

  .alternative-grid {
    grid-template-columns: 1fr;
  }
}
</style>
