<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <p class="not-found__code" aria-hidden="true">404</p>
    <h1>Workout nicht gefunden.</h1>
    <p class="not-found__text">Diese Seite existiert nicht oder wurde verschoben.</p>
    <RouterLink class="btn" :to="{ name: 'trainings' }">Zurück zu deinen Trainings</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-block: var(--space-12);
}

.not-found__code {
  margin: 0;
  font: 700 clamp(6rem, 25vw, 11rem) / 1 var(--font-heading);
  letter-spacing: -0.05em;
  color: var(--color-primary);
}

.not-found__text {
  margin: 0 0 var(--space-6);
  color: var(--color-text-muted);
}
</style>
