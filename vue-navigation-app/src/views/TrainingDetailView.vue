<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import TrainingExerciseList from '@/components/TrainingExerciseList.vue'
import TrainingStats from '@/components/TrainingStats.vue'
import AppIcon from '@/components/AppIcon.vue'
import { getTrainingById } from '@/utils/data'

const route = useRoute()
const training = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? getTrainingById(id) : undefined
})
const formattedDate = computed(() => training.value
  ? new Date(`${training.value.date}T00:00:00`).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
  : '')
</script>

<template>
  <h1>Training Detail</h1>
  <template v-if="training">
    <dl class="training-overview" aria-label="Trainingsinformationen">
      <div class="training-overview__item">
        <dt><AppIcon name="muscle" /> Trainingsart</dt>
        <dd class="training-overview__type">{{ training.type }}</dd>
      </div>
      <div class="training-overview__item">
        <dt><AppIcon name="date" /> Datum</dt>
        <dd><time :datetime="training.date">{{ formattedDate }}</time></dd>
      </div>
      <div class="training-overview__item">
        <dt><AppIcon name="duration" /> Dauer</dt>
        <dd>{{ training.duration }} <span class="training-overview__unit">Minuten</span></dd>
      </div>
      <div class="training-overview__item">
        <dt><AppIcon name="exercises" /> Übungen</dt>
        <dd>{{ training.exercises.length }}</dd>
      </div>
    </dl>
    <TrainingStats :training="training" />
    <TrainingExerciseList :training="training" />
  </template>
  <p v-else>Training nicht gefunden.</p>
  <RouterLink class="btn btn--secondary" :to="{ name: 'trainings' }">Zurück zu Trainings</RouterLink>
</template>

<style scoped>
.training-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0 0 var(--space-8);
  padding: var(--space-6) 0;
  background: var(--color-card);
  border-radius: var(--radius-lg);
}

.training-overview__item {
  min-width: 0;
  padding: var(--space-2) var(--space-6);
}

.training-overview__item + .training-overview__item {
  border-left: 1px solid var(--color-border);
}

.training-overview dt {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.training-overview dd {
  margin: 0;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.training-overview__type { color: var(--color-primary); }
.training-overview__unit { font-size: 0.875rem; font-weight: 500; }

@media (max-width: 56rem) {
  .training-overview { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0; }
  .training-overview__item { padding: var(--space-6); }
  .training-overview__item:nth-child(3) { border-left: 0; }
  .training-overview__item:nth-child(n + 3) { border-top: 1px solid var(--color-border); }
}

@media (max-width: 30rem) {
  .training-overview { grid-template-columns: 1fr; }
  .training-overview__item { padding: var(--space-4) var(--space-6); }
  .training-overview__item + .training-overview__item { border-left: 0; border-top: 1px solid var(--color-border); }
  .training-overview dt { margin-bottom: var(--space-2); }
}
</style>
