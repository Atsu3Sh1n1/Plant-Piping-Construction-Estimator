import { computed, type Ref } from 'vue';
import type { Pipe, Elbow, Material } from '@/types/materials';

export function useScheduleFilter(
  pipes: Pipe[],
  elbows: Elbow[],
  selectedType: Ref<'pipe' | 'elbow' | 'valve' | ''>,
  selectedStandard: Ref<string>,
  selectedMaterial: Ref<Material | null>,
  selectedSize: Ref<string>
) {
  const availableSchedules = computed(() => {
    if ((selectedType.value !== 'pipe' && selectedType.value !== 'elbow') || !selectedSize.value || !selectedMaterial.value) return [];

    const items = selectedType.value === 'pipe' ? pipes : elbows;
    const matchedItem = items.find(
      item =>
        item.standard === selectedStandard.value &&
        (Array.isArray(item.materialId)
          ? item.materialId.includes(selectedMaterial.value!.id)
          : item.materialId === selectedMaterial.value!.id) &&
        item.sizes && selectedSize.value in item.sizes
    );
    if (!matchedItem) return [];

    const selectedMatId = selectedMaterial.value!.id.toLowerCase();
    const isStainless = selectedMatId.includes('sus');

    const scheduleKeys = Object.keys(matchedItem.sizes[selectedSize.value]);
    
    // Expand comma-separated keys
    const allSchedules = scheduleKeys.flatMap(key => 
      key.includes(',') ? key.split(',') : [key]
    );

    return allSchedules.filter(schedule => {
      const lower = schedule.toLowerCase();
      if (isStainless) {
        return lower.endsWith('s');
      } else {
        return !lower.endsWith('s');
      }
    });
  });

  return { availableSchedules };
}
