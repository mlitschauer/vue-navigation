import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './assets/styles/main.css'
import router from './router'
import { TRAININGS_STORAGE_KEY, useTrainingsStore } from './stores/trainings'

const app = createApp(App)

app.use(createPinia())
const trainingsStore = useTrainingsStore()
window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage && (event.key === TRAININGS_STORAGE_KEY || event.key === null)) {
    trainingsStore.loadTrainings()
  }
})
app.use(router)

app.mount('#app')
