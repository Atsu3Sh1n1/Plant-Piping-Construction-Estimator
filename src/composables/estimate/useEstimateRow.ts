import { ref, computed, watch, type Ref } from 'vue';
import { pipes } from '@/data/materials/pipes';
import { valves } from '@/data/materials/valve';
import { materials } from '@/data/materials/materials';
import { usePipeCalculator } from './usePipeCalculator';
import { useValveCalculator } from './useValveCalculator';
import { useScheduleFilter } from './useScheduleFilter';
import { useLengthConverter } from './useLengthConverter';
import type { Material } from '@/types/materials';

function includesMaterialId(itemMaterialId: string | string[], selectedId: string): boolean {
  return Array.isArray(itemMaterialId)
    ? itemMaterialId.includes(selectedId)
    : itemMaterialId === selectedId;
}

export function useEstimateRow(sharedUnit?: Ref<'m' | 'ft'>) {
  const selectedType = ref<'pipe' | 'valve' | ''>('');
  const selectedStandard = ref('');
  const selectedMaterial = ref<Material | null>(null);
  const selectedSize = ref('');
  const selectedSchedule = ref('');
  const selectedClass = ref('');
  const quantity = ref(0);
  const weight = ref(0);

  const { lengthValue, unit, convertedValue } = useLengthConverter({
    units: ['m', 'ft'],
    toMeterFactor: 0.3048,
    unit: sharedUnit,
  });

  const actualUnit = sharedUnit || unit;

  const lengthInMeters = computed(() =>
    actualUnit.value === 'm' ? lengthValue.value : lengthValue.value * 0.3048
  );

  const { calculatePipeWeight } = usePipeCalculator();
  const { calculateValveWeight } = useValveCalculator();

  // useScheduleFilter から availableSchedules を取得
  const { availableSchedules } = useScheduleFilter(
    pipes,
    selectedType,
    selectedStandard,
    selectedMaterial,
    selectedSize
  );

  const availableStandards = computed(() => {
    if (!selectedType.value) return [];
    const items = selectedType.value === 'pipe' ? pipes : valves;
    return [...new Set(items.map(i => i.standard))];
  });

  const availableMaterials = computed(() => {
    if (!selectedType.value || !selectedStandard.value) return [];
    const items = selectedType.value === 'pipe' ? pipes : valves;
    const materialIds = new Set(
      items
        .filter(i => i.standard === selectedStandard.value)
        .flatMap(i => (Array.isArray(i.materialId) ? i.materialId : [i.materialId]))
    );
    return materials.filter(m => materialIds.has(m.id));
  });

  const availableSizes = computed(() => {
    if (!selectedType.value || !selectedStandard.value || !selectedMaterial.value) return [];
    if (selectedType.value === 'pipe') {
      const matchedPipes = pipes.filter(
        p =>
          p.standard === selectedStandard.value &&
          includesMaterialId(p.materialId, selectedMaterial.value!.id)
      );
      const allSizes = matchedPipes.flatMap(p => Object.keys(p.sizes));
      return [...new Set(allSizes)];
    } else {
      const matchedValves = valves.filter(
        v =>
          v.standard === selectedStandard.value &&
          includesMaterialId(v.materialId, selectedMaterial.value!.id)
      );
      return [...new Set(matchedValves.map(v => v.size))];
    }
  });

  const availableClasses = computed(() => {
    if (selectedType.value !== 'valve' || !selectedSize.value || !selectedMaterial.value) return [];
    const valve = valves.find(
      v =>
        v.standard === selectedStandard.value &&
        includesMaterialId(v.materialId, selectedMaterial.value!.id) &&
        v.size === selectedSize.value
    );
    return valve ? Object.keys(valve.class) : [];
  });

  const resetSelections = () => {
    selectedStandard.value = '';
    selectedMaterial.value = null;
    selectedSize.value = '';
    selectedSchedule.value = '';
    selectedClass.value = '';
    quantity.value = 0;
    weight.value = 0;
  };

  const updateMaterialOptions = () => {
    selectedMaterial.value = null;
    selectedSize.value = '';
    selectedSchedule.value = '';
    selectedClass.value = '';
    weight.value = 0;
  };

  const updateSizeOptions = () => {
    selectedSize.value = '';
    selectedSchedule.value = '';
    selectedClass.value = '';
    weight.value = 0;
  };

  const updateScheduleOrClassOptions = () => {
    selectedSchedule.value = '';
    selectedClass.value = '';
    weight.value = 0;
  };

  const calculateWeight = () => {
    if (
      selectedType.value === 'pipe' &&
      selectedStandard.value &&
      selectedMaterial.value &&
      selectedSize.value &&
      selectedSchedule.value &&
      lengthInMeters.value > 0
    ) {
      const pipe = pipes.find(
        p =>
          p.standard === selectedStandard.value &&
          includesMaterialId(p.materialId, selectedMaterial.value!.id) &&
          p.sizes[selectedSize.value]?.[selectedSchedule.value]
      );
      if (pipe) {
        weight.value = calculatePipeWeight(
          pipe,
          selectedSize.value,
          selectedSchedule.value,
          lengthInMeters.value,
          selectedMaterial.value!.id
        );
      } else {
        weight.value = 0;
      }
    } else if (
      selectedType.value === 'valve' &&
      selectedStandard.value &&
      selectedMaterial.value &&
      selectedSize.value &&
      selectedClass.value &&
      quantity.value > 0
    ) {
      const valve = valves.find(
        v =>
          v.standard === selectedStandard.value &&
          includesMaterialId(v.materialId, selectedMaterial.value!.id) &&
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
    scheduleOrClass:
      selectedType.value === 'pipe'
        ? selectedSchedule.value || 'N/A'
        : selectedClass.value || 'N/A',
    lengthOrQuantity: selectedType.value === 'pipe' ? lengthInMeters.value : quantity.value,
    weight: weight.value,
  });

  watch([lengthInMeters, quantity], () => {
    calculateWeight();
  });

  return {
    selectedType,
    selectedStandard,
    selectedMaterial,
    selectedSize,
    selectedSchedule,
    selectedClass,
    quantity,
    weight,
    availableStandards,
    availableMaterials,
    availableSizes,
    availableSchedules, // ここは useScheduleFilter 由来
    availableClasses,
    resetSelections,
    updateMaterialOptions,
    updateSizeOptions,
    updateScheduleOrClassOptions,
    calculateWeight,
    getRowData,
    lengthValue,
    convertedValue,
  };
}
