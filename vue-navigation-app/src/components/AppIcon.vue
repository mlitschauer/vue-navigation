<script setup lang="ts">
// Einfache Linien-Icons (24x24). Neue Icons: Name + SVG-Pfade hier ergänzen.
const icons = {
  duration: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/>',
  date: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  muscle: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  equipment: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  exercises: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  alternative: '<path d="M17 3l4 4-4 4"/><path d="M21 7H8a4 4 0 0 0-4 4"/><path d="M7 21l-4-4 4-4"/><path d="M3 17h13a4 4 0 0 0 4-4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  logo:'<path d="M4 15l6-9 4 6 2-3 4 6z"/>',
} as const

defineProps<{ name: keyof typeof icons; size?: number; strokeWidth?: number }>()
</script>

<template>
  <svg
    class="icon"
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth ?? 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="icons[name]"
  />
</template>

<style scoped>
.icon { flex-shrink: 0; }
</style>
