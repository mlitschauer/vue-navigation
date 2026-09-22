<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ExerciseCard from '@/components/ExerciseCard.vue'
import ExerciseImage from '@/components/ExerciseImage.vue'
import { getExerciseAlternatives, getExerciseById } from '@/utils/data'
const route = useRoute()
const exercise = computed(() => typeof route.params.id === 'string' ? getExerciseById(route.params.id) : undefined)
const alternatives = computed(() => exercise.value ? getExerciseAlternatives(exercise.value) : [])
</script>

<template>
  <section class="exercise-detail-view">
    <template v-if="exercise">
      <h1>{{ exercise.name }}</h1>
      <figure class="exercise-detail-view__figure">
        <ExerciseImage :exercise="exercise" />
        <figcaption>{{ exercise.id === 18 ? 'Halteposition im Unterarmstütz.' : 'Bewegungsskizze: Ausgangsposition links, Endposition rechts.' }}</figcaption>
      </figure>
      <dl>
        <dt>Muskelgruppe</dt><dd>{{ exercise.muscleGroup }}</dd>
        <dt>Equipment</dt><dd>{{ exercise.equipment }}</dd>
        <dt>Beschreibung</dt><dd>{{ exercise.description }}</dd>
      </dl>
      <section class="exercise-detail-view__section" aria-labelledby="execution-title">
        <h2 id="execution-title">Ausführung</h2>
        <ol v-if="exercise.execution.length" class="execution-steps">
          <li v-for="(step, index) in exercise.execution" :key="`${exercise.id}-${index}`">{{ step }}</li>
        </ol>
        <p v-else>Keine Ausführungsschritte vorhanden.</p>
      </section>
      <section class="exercise-detail-view__section" aria-labelledby="alternatives-title">
        <h2 id="alternatives-title">Alternative Übungen</h2>
        <div v-if="alternatives.length" class="card-grid">
          <ExerciseCard v-for="alternative in alternatives" :key="alternative.id" :exercise="alternative" />
        </div>
        <p v-else>Keine alternativen Übungen vorhanden.</p>
      </section>
    </template>
    <template v-else><h1>Übung Detail</h1><p>Übung nicht gefunden.</p></template>
    <RouterLink class="btn btn--secondary" :to="{ name: 'exercises' }">Zurück zu Übungen</RouterLink>
  </section>
</template>

<style scoped>
.exercise-detail-view { overflow-wrap: anywhere; }
.exercise-detail-view__figure { margin: 0; }
figcaption { margin-top: var(--space-2); text-align: center; color: var(--color-text-muted); font-size: 0.875rem; }
.exercise-detail-view__section { margin-block: var(--space-6); }
.execution-steps { display: grid; gap: var(--space-3); padding-left: var(--space-6); }
</style>
