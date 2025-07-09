import { ref, computed, watch, type Ref } from 'vue';
import { materials } from '@/data/materials/materials';
import { useItemCalculator } from './useItemCalculator';
import { useScheduleFilter } from './useScheduleFilter';
import { useLengthConverter } from './useLengthConverter';
import { ITEM_CONFIGS, type ItemType } from '@/types/itemTypes';
import type { Material } from '@/types/materials';

function includesMaterialId(itemMaterialId: string | string[], selectedId: string): boolean {
  return Array.isArray(itemMaterialId)
    ? itemMaterialId.includes(selectedId)
    : itemMaterialId === selectedId;
}

export function useEstimateRow(sharedUnit?: Ref<'m' | 'ft'>) {
  const selectedType = ref<ItemType | ''>('');
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

  const { getItemData, calculateWeight: calculateItemWeight } = useItemCalculator();

  // useScheduleFilter から availableSchedules を取得
  const { availableSchedules } = useScheduleFilter(
    getItemData('pipe') as any,
    getItemData('elbow') as any,
    selectedType as any,
    selectedStandard,
    selectedMaterial,
    selectedSize
  );

  const availableStandards = computed(() => {
    if (!selectedType.value) return [];
    const items = getItemData(selectedType.value as ItemType);
    return [...new Set(items.map((i: any) => i.standard))];
  });

  const availableMaterials = computed(() => {
    if (!selectedType.value || !selectedStandard.value) return [];
    const items = getItemData(selectedType.value as ItemType);
    const materialIds = new Set(
      items
        .filter((i: any) => i.standard === selectedStandard.value)
        .flatMap((i: any) => (Array.isArray(i.materialId) ? i.materialId : [i.materialId]))
    );
    return materials.filter(m => materialIds.has(m.id));
  });

  const availableSizes = computed(() => {
    if (!selectedType.value || !selectedStandard.value || !selectedMaterial.value) return [];
    const items = getItemData(selectedType.value as ItemType);
    const config = ITEM_CONFIGS[selectedType.value as ItemType];
    
    if (config.calculationType === 'density') {
      const matchedItems = items.filter(
        (item: any) =>
          item.standard === selectedStandard.value &&
          includesMaterialId(item.materialId, selectedMaterial.value!.id)
      );
      const allSizes = matchedItems.flatMap((item: any) => Object.keys(item.sizes));
      return [...new Set(allSizes)];
    } else {
      const matchedItems = items.filter(
        (item: any) =>
          item.standard === selectedStandard.value &&
          includesMaterialId(item.materialId, selectedMaterial.value!.id)
      );
      return [...new Set(matchedItems.map((item: any) => item.size))];
    }
  });

  const availableClasses = computed(() => {
    if (!selectedType.value || !selectedSize.value || !selectedMaterial.value) return [];
    const config = ITEM_CONFIGS[selectedType.value as ItemType];
    if (!config.hasClass) return [];
    
    const items = getItemData(selectedType.value as ItemType);
    const item = items.find(
      (v: any) =>
        v.standard === selectedStandard.value &&
        includesMaterialId(v.materialId, selectedMaterial.value!.id) &&
        v.size === selectedSize.value
    );
    return item ? Object.keys((item as any).class) : [];
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
    if (!selectedType.value || !selectedStandard.value || !selectedMaterial.value || !selectedSize.value) {
      weight.value = 0;
      return;
    }

    const config = ITEM_CONFIGS[selectedType.value as ItemType];
    const scheduleOrClass = config.hasClass ? selectedClass.value : selectedSchedule.value;
    const lengthOrQuantity = config.inputType === 'length' ? lengthInMeters.value : quantity.value;

    if (!scheduleOrClass || lengthOrQuantity <= 0) {
      weight.value = 0;
      return;
    }

    weight.value = calculateItemWeight(
      selectedType.value as ItemType,
      selectedStandard.value,
      selectedMaterial.value,
      selectedSize.value,
      scheduleOrClass,
      lengthOrQuantity
    );
  };

  const getRowData = () => {
    const config = selectedType.value ? ITEM_CONFIGS[selectedType.value as ItemType] : null;
    return {
      type: selectedType.value || 'N/A',
      standard: selectedStandard.value || 'N/A',
      material: selectedMaterial.value?.id || 'N/A',
      size: selectedSize.value || 'N/A',
      scheduleOrClass: config?.hasClass ? selectedClass.value || 'N/A' : selectedSchedule.value || 'N/A',
      lengthOrQuantity: config?.inputType === 'length' ? lengthInMeters.value : quantity.value,
      weight: weight.value,
    };
  };

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
