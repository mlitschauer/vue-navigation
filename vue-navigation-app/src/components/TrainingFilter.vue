<script setup lang="ts">
import { trainingTypes } from '@/types/training'
defineProps<{
  selectedType: string
  sortOrder: 'newest' | 'oldest'
}>()

defineEmits<{
  'update:selectedType': [value: string]
  'update:sortOrder': [value: 'newest' | 'oldest']
}>()
</script>

<template>
  <div class="training-filter">
    <label class="training-filter__field">
      <span>Trainingsart</span>
      <select
        :value="selectedType"
        @change="$emit('update:selectedType', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">Alle</option>
        <option v-for="type in trainingTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </label>

    <label class="training-filter__field">
      <span>Sortieren</span>
      <select
        :value="sortOrder"
        @change="$emit('update:sortOrder', ($event.target as HTMLSelectElement).value as 'newest' | 'oldest')"
      >
        <option value="newest">Neueste zuerst</option>
        <option value="oldest">Älteste zuerst</option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.training-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.training-filter__field {
  display: grid;
  gap: 0.375rem;
  font-weight: 600;
}

select {
  min-width: 12rem;
  padding: 0.5rem;
  color: inherit;
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 0.25rem;
  font: inherit;
}

@media (max-width: 40rem) {
  .training-filter {
    flex-direction: column;
  }

  select {
    width: 100%;
    min-width: 0;
  }
}
</style>
