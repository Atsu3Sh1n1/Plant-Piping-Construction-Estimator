import { computed, type Ref } from 'vue';
import type { Pipe, Material } from '@/types/materials';

export function useScheduleFilter(
  pipes: Pipe[],
  selectedType: Ref<'pipe' | 'valve' | ''>,
  selectedStandard: Ref<string>,
  selectedMaterial: Ref<Material | null>,
  selectedSize: Ref<string>
) {
  const availableSchedules = computed(() => {
    if (selectedType.value !== 'pipe' || !selectedSize.value || !selectedMaterial.value) return [];

    const matchedPipe = pipes.find(
      p =>
        p.standard === selectedStandard.value &&
        (Array.isArray(p.materialId)
          ? p.materialId.includes(selectedMaterial.value!.id)
          : p.materialId === selectedMaterial.value!.id) &&
        p.sizes && selectedSize.value in p.sizes
    );
    if (!matchedPipe) return [];

    const selectedMatId = selectedMaterial.value!.id.toLowerCase();
    const isStainless = selectedMatId.includes('sus');

    const schedules = Object.keys(matchedPipe.sizes[selectedSize.value]);

    return schedules.filter(schedule => {
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
