<template>
  <section class="trainings-view">
    <header class="trainings-view__header">
      <h1>Meine Trainings</h1>
    </header>
    <div class="trainings-view__actions">
      <p>Vergangene Trainingseinheiten</p>
      <RouterLink class="btn trainings-view__create" :to="{ name: 'training-create' }">Neues Training</RouterLink>
    </div>
    <p v-if="storageWarning" role="status">{{ storageWarning }}</p>

    <aside class="trainings-view__controls" aria-label="Filter und Sortierung">
      <TrainingFilter
        v-model:selected-type="selectedType"
        v-model:sort-order="sortOrder"
      />
    </aside>

    <section aria-labelledby="training-list-title">
      <h2 id="training-list-title" class="visually-hidden">Trainingseinheiten</h2>
      <div v-if="filteredAndSortedTrainings.length" class="card-grid">
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
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TrainingCard from '@/components/TrainingCard.vue'
import TrainingFilter from '@/components/TrainingFilter.vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTrainingsStore } from '@/stores/trainings'
const { trainings, storageWarning } = storeToRefs(useTrainingsStore())

const selectedType = ref('all')
const sortOrder = ref<'newest' | 'oldest'>('newest')

const filteredAndSortedTrainings = computed(() => {
  const filteredTrainings = selectedType.value === 'all'
    ? trainings.value
    : trainings.value.filter((training) => training.type === selectedType.value)

  return [...filteredTrainings].sort((firstTraining, secondTraining) => {
    const dateDifference = new Date(firstTraining.date).getTime()
      - new Date(secondTraining.date).getTime()

    return sortOrder.value === 'newest' ? -dateDifference : dateDifference
  })
})
</script>

<style scoped>
.trainings-view {
  max-width: var(--content-width);
  margin-inline: auto;
}

.trainings-view__header {
  margin-bottom: 1.5rem;
}

.trainings-view__header h1 {
  margin-bottom: var(--space-8);
  text-align: left;
}

.trainings-view__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.trainings-view__actions p,
.trainings-view__controls p,
.empty-state p {
  margin: 0;
}

.trainings-view__actions p {
  color: var(--color-text-muted);
}

.trainings-view__controls {
  margin-bottom: 1.5rem;
  padding: 1rem;
  color: #555;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
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

</style>
