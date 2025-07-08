import { ref } from 'vue'
import { materials } from '@/data/materials/materials'

export const useMaterialData = () => {
  return {
    materials: ref(materials)
  }
}