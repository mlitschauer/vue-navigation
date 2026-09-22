<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="header">
    <RouterLink class="logo" :to="{ name: 'trainings' }">Insight Fitness</RouterLink>

    <nav class="nav" aria-label="Hauptnavigation">
      <RouterLink
        :to="{ name: 'trainings' }"
        :class="{ 'router-link-active': route.name === 'training-detail' || route.name === 'training-create' }"
      >Trainingseinheiten</RouterLink>
      <RouterLink
        :to="{ name: 'exercises' }"
        :class="{ 'router-link-active': route.name === 'exercise-detail' }"
      >Übungen</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
/* Titel links, Links rechts, alles in einer Zeile mit blauer Linie darunter */
.header {
  max-width: var(--content-width);
  margin: 1.25rem auto 0;
  padding: var(--space-3) var(--space-4);
  border-bottom: 2px solid var(--color-primary);
  display: flex;
  flex-wrap: wrap;         /* Smartphone: Links rutschen unter den Titel */
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-8);
}

.logo {
  display: inline-block;
  color: var(--color-primary);
  font: 700 clamp(1.25rem, 3vw, 1.75rem) / 1 var(--font-heading);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-8);
}

.nav a {
  padding-block: 0;
  line-height: 1.3;
  border-bottom: 2px solid transparent;
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
  transition: border-color var(--transition), color var(--transition);
}

.nav a:hover {
  color: var(--color-primary);
}

/* aktuelle Seite (auch Detailseiten, siehe :class im Template) */
.nav a.router-link-active {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 700;
}
</style>
