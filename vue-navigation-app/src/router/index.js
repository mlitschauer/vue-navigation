import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'trainings' } },
    {
      path: '/trainings',
      name: 'trainings',
      component: () => import('@/views/TrainingsView.vue'),
    },
    {
      path: '/trainings/new',
      name: 'training-create',
      component: () => import('@/views/TrainingCreateView.vue'),
    },
    {
      path: '/trainings/:id',
      name: 'training-detail',
      component: () => import('@/views/TrainingDetailView.vue'),
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import('@/views/ExercisesView.vue'),
    },
    {
      path: '/exercises/:id',
      name: 'exercise-detail',
      component: () => import('@/views/ExerciseDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
