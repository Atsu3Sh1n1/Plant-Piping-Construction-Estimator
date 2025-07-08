import { ref, computed } from 'vue';
import { pipes } from '@/data/materials/pipes';
import { valves } from '@/data/materials/valve';
import type { Pipe, Valve } from '@/types/materials';
import { usePipeCalculator } from './usePipeCalculator';
import { useValveCalculator } from './useValveCalculator';

export function useCalculators() {
  const selectedType = ref<'pipe' | 'valve' | ''>('');
  const selectedStandard = ref('');
  const selectedMaterial = ref<any>(null);
  const selectedSize = ref('');
  const selectedSchedule = ref('');
  const selectedClass = ref('');
  const length = ref(0);
  const quantity = ref(0);
  const weight = ref(0);

  const { calculatePipeWeight, getDensity } = usePipeCalculator();
  const { calculateValveWeight } = useValveCalculator();

  const availableStandards = computed(() => {
    const items = selectedType.value === 'pipe' ? pipes : valves;
    return [...new Set(items.map(i => i.standard))];
  });

  const availableMaterials = computed(() => {
    const items = selectedType.value === 'pipe' ? pipes : valves;
    const filtered = items.filter(i => i.standard === selectedStandard.value);
    const map = new Map<string, any>();

    filtered.forEach(i => {
      if (selectedType.value === 'pipe') {
        const pipe = i as Pipe;
        const density = getDensity(pipe);
        map.set(pipe.materialId, { id: pipe.materialId, density });
      } else {
        const valve = i as Valve;
        map.set(valve.materialId, { id: valve.materialId, density: 7.85 });
      }
    });

    return [...map.values()];
  });

  const availableSizes = computed(() => {
    const items = selectedType.value === 'pipe' ? pipes : valves;
    return [
      ...new Set(
        items
          .filter(i => i.standard === selectedStandard.value && i.materialId === selectedMaterial.value?.id)
          .map(i => i.size)
      ),
    ];
  });

  const availableSchedules = computed(() => {
    if (selectedType.value !== 'pipe') return [];
    return [
      ...new Set(
        pipes
          .filter(p =>
            p.standard === selectedStandard.value &&
            p.materialId === selectedMaterial.value?.id &&
            p.size === selectedSize.value
          )
          .flatMap(p => Object.keys(p.schedules))
      ),
    ];
  });

  const availableClasses = computed(() => {
    if (selectedType.value !== 'valve') return [];
    const match = valves.find(
      v => v.standard === selectedStandard.value &&
        v.materialId === selectedMaterial.value?.id &&
        v.size === selectedSize.value
    );
    return match ? Object.keys(match.class) : [];
  });

  const calculateWeight = () => {
    if (selectedType.value === 'pipe') {
      const pipe = pipes.find(
        p =>
          p.standard === selectedStandard.value &&
          p.materialId === selectedMaterial.value?.id &&
          p.size === selectedSize.value &&
          selectedSchedule.value in p.schedules
      );
      if (pipe) {
        weight.value = calculatePipeWeight(pipe, selectedSchedule.value, length.value);
      } else {
        weight.value = 0;
      }
    } else if (selectedType.value === 'valve') {
      const valve = valves.find(
        v =>
          v.standard === selectedStandard.value &&
          v.materialId === selectedMaterial.value?.id &&
          v.size === selectedSize.value
      );
      if (valve) {
        weight.value = calculateValveWeight(valve, selectedClass.value, quantity.value);
      } else {
        weight.value = 0;
      }
    } else {
      weight.value = 0;
    }
  };

  const getRowData = () => ({
    type: selectedType.value || 'N/A',
    standard: selectedStandard.value || 'N/A',
    material: selectedMaterial.value?.id || 'N/A',
    size: selectedSize.value || 'N/A',
    scheduleOrClass: selectedType.value === 'pipe'
      ? selectedSchedule.value || 'N/A'
      : selectedClass.value || 'N/A',
    lengthOrQuantity: selectedType.value === 'pipe' ? length.value : quantity.value,
    weight: weight.value,
  });

  const resetSelections = () => {
    selectedStandard.value = '';
    selectedMaterial.value = null;
    selectedSize.value = '';
    selectedSchedule.value = '';
    selectedClass.value = '';
    length.value = 0;
    quantity.value = 0;
    weight.value = 0;
  };

  const updateMaterialOptions = () => {
    selectedMaterial.value = null;
    selectedSize.value = '';
    selectedSchedule.value = '';
    selectedClass.value = '';
  };

  const updateSizeOptions = () => {
    selectedSize.value = '';
    selectedSchedule.value = '';
    selectedClass.value = '';
  };

  const updateScheduleOrClassOptions = () => {
    selectedSchedule.value = '';
    selectedClass.value = '';
  };

  return {
    selectedType,
    selectedStandard,
    selectedMaterial,
    selectedSize,
    selectedSchedule,
    selectedClass,
    length,
    quantity,
    weight,

    availableStandards,
    availableMaterials,
    availableSizes,
    availableSchedules,
    availableClasses,

    resetSelections,
    updateMaterialOptions,
    updateSizeOptions,
    updateScheduleOrClassOptions,
    calculateWeight,
    getRowData,
  };
}
