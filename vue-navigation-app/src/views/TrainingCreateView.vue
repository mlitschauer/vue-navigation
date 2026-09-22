<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TrainingForm from '@/components/TrainingForm.vue'
import { useTrainingsStore } from '@/stores/trainings'
import type { TrainingDraft } from '@/types/training'

const router = useRouter()
const store = useTrainingsStore()
const saving = ref(false)
const saveError = ref('')
async function save(draft: TrainingDraft): Promise<void> {
  if (saving.value) return
  saving.value = true
  saveError.value = ''
  try {
    const training = await store.createTraining(draft)
    await router.push({ name: 'training-detail', params: { id: training.id } })
  } catch (error: unknown) {
    saveError.value = error instanceof Error ? error.message : 'Das Training konnte nicht gespeichert werden.'
  } finally { saving.value = false }
}
</script>

<template>
  <section class="training-create-view">
    <h1>Neues Training</h1>
    <p v-if="store.storageWarning" role="status">{{ store.storageWarning }}</p>
    <TrainingForm :saving="saving" :save-error="saveError" @submit="save" />
  </section>
</template>
