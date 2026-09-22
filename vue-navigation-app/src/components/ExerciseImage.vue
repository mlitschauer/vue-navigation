<script setup lang="ts">
import { ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import type { Exercise } from '@/types/exercise'
const props = defineProps<{ exercise: Exercise; compact?: boolean }>()
const failed = ref(false)
watch(() => [props.exercise.id, props.exercise.image], () => { failed.value = false })
</script>

<template>
  <div class="exercise-image" :class="{ 'exercise-image--compact': compact }">
    <img v-if="exercise.image && !failed" :src="exercise.image"
      :alt="compact ? '' : exercise.id === 18 ? 'Plank: schematische Halteposition im Unterarmstütz.' : `${exercise.name}: schematische Ausgangs- und Endposition, von links nach rechts.`"
      :loading="compact ? 'lazy' : 'eager'" width="720" height="360" @error="failed = true">
    <div v-else class="exercise-image__fallback" role="img" :aria-label="`Keine Illustration für ${exercise.name} verfügbar`">
      <AppIcon name="equipment" :size="40" />
      <span v-if="!compact">Illustration nicht verfügbar</span>
    </div>
  </div>
</template>

<style scoped>
.exercise-image { width: 100%; max-width: 48rem; margin-inline: auto; aspect-ratio: 2 / 1; overflow: hidden; border-radius: var(--radius-sm); background: var(--color-primary-soft); color: var(--color-primary); }
.exercise-image img { display: block; width: 100%; height: 100%; object-fit: contain; }
.exercise-image--compact { max-height: 9rem; }
.exercise-image__fallback { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-3); width: 100%; height: 100%; text-align: center; }
</style>
