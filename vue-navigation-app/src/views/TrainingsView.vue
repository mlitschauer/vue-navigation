<template>
  <main class="trainings-view">
    <header class="trainings-view__header">
      <h1>Meine Trainings</h1>
      <p>Vergangene Trainingseinheiten</p>
    </header>

    <aside class="trainings-view__controls" aria-label="Filter und Sortierung">
      <TrainingFilter
        v-model:selected-type="selectedType"
        v-model:sort-order="sortOrder"
      />
    </aside>

    <section aria-labelledby="training-list-title">
      <h2 id="training-list-title" class="visually-hidden">Trainingseinheiten</h2>
      <div v-if="filteredAndSortedTrainings.length" class="training-grid">
        <TrainingCard
          v-for="training in filteredAndSortedTrainings"
          :key="training.id"
          :training="training"
        />
      </div>
      <div v-else-if="trainings.length === 0" class="empty-state">
        <p>Noch keine Trainings vorhanden.</p>
        <p>Sobald Trainings vorhanden sind, erscheinen sie hier.</p>
      </div>
      <div v-else class="empty-state">
        <p>Keine Trainings gefunden.</p>
        <p>Versuche einen anderen Filter.</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TrainingCard from '@/components/TrainingCard.vue'
import TrainingFilter from '@/components/TrainingFilter.vue'
import { trainings } from '@/data/trainings'

const selectedType = ref('all')
const sortOrder = ref<'newest' | 'oldest'>('newest')

const filteredAndSortedTrainings = computed(() => {
  const filteredTrainings = selectedType.value === 'all'
    ? trainings
    : trainings.filter((training) => training.type === selectedType.value)

  return [...filteredTrainings].sort((firstTraining, secondTraining) => {
    const dateDifference = new Date(firstTraining.date).getTime()
      - new Date(secondTraining.date).getTime()

    return sortOrder.value === 'newest' ? -dateDifference : dateDifference
  })
})
</script>

<style scoped>
.trainings-view {
  max-width: 72rem;
  margin-inline: auto;
  padding: 1.5rem;
}

.trainings-view__header {
  margin-bottom: 1.5rem;
}

.trainings-view__header h1,
.trainings-view__header p,
.trainings-view__controls p,
.empty-state p {
  margin: 0;
}

.trainings-view__header p {
  margin-top: 0.5rem;
  color: #555;
}

.trainings-view__controls {
  margin-bottom: 1.5rem;
  padding: 1rem;
  color: #555;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.training-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.empty-state {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.empty-state p + p {
  margin-top: 0.5rem;
  color: #555;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 40rem) {
  .trainings-view {
    padding: 1rem;
  }

  .training-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 40.01rem) and (max-width: 56rem) {
  .training-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
