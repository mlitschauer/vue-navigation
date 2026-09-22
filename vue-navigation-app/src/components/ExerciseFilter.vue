<script setup lang="ts">
defineProps<{
  searchTerm: string
  selectedMuscleGroup: string
  selectedEquipment: string
  muscleGroups: string[]
  equipmentOptions: string[]
}>()

defineEmits<{
  'update:searchTerm': [value: string]
  'update:selectedMuscleGroup': [value: string]
  'update:selectedEquipment': [value: string]
  reset: []
}>()
</script>

<template>
  <div class="exercise-filter">
    <label class="exercise-filter__field" for="exercise-search">
      <span>Übung suchen</span>
      <input
        id="exercise-search"
        type="search"
        :value="searchTerm"
        @input="$emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <label class="exercise-filter__field" for="muscle-group-filter">
      <span>Muskelgruppe</span>
      <select
        id="muscle-group-filter"
        :value="selectedMuscleGroup"
        @change="$emit('update:selectedMuscleGroup', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">Alle</option>
        <option v-for="muscleGroup in muscleGroups" :key="muscleGroup" :value="muscleGroup">
          {{ muscleGroup }}
        </option>
      </select>
    </label>

    <label class="exercise-filter__field" for="equipment-filter">
      <span>Equipment</span>
      <select
        id="equipment-filter"
        :value="selectedEquipment"
        @change="$emit('update:selectedEquipment', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">Alle</option>
        <option v-for="equipment in equipmentOptions" :key="equipment" :value="equipment">
          {{ equipment }}
        </option>
      </select>
    </label>

    <button class="btn btn--secondary" type="button" @click="$emit('reset')">
      Filter zurücksetzen
    </button>
  </div>
</template>

<style scoped>
.exercise-filter {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
}

.exercise-filter__field {
  display: grid;
  gap: 0.375rem;
  min-width: 0;
  font-weight: 600;
}

input,
select {
  min-width: 0;
  padding: 0.5rem;
  color: inherit;
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 0.25rem;
  font: inherit;
}

@media (max-width: 56rem) {
  .exercise-filter {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 40rem) {
  .exercise-filter {
    grid-template-columns: 1fr;
  }
}
</style>
