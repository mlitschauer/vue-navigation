export interface Exercise {
  id: number
  name: string
  muscleGroup: string
  equipment: string
  description: string
  execution: string[]
  alternatives: number[]
  image?: string
}
