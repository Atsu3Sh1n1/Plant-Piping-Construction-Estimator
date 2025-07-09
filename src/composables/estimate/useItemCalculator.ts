import { pipes } from '@/data/materials/pipes';
import { elbows } from '@/data/materials/elbow';
import { valves } from '@/data/materials/valve';
import { usePipeCalculator } from './usePipeCalculator';
import { useElbowCalculator } from './useElbowCalculator';
import { useValveCalculator } from './useValveCalculator';
import { ITEM_CONFIGS, type ItemType } from '@/types/itemTypes';
import type { Material } from '@/types/materials';

export function useItemCalculator() {
  const { calculatePipeWeight } = usePipeCalculator();
  const { calculateElbowWeight } = useElbowCalculator();
  const { calculateValveWeight } = useValveCalculator();

  const getItemData = (itemType: ItemType) => {
    switch (itemType) {
      case 'pipe': return pipes;
      case 'elbow': return elbows;
      case 'valve': return valves;
      default: return [];
    }
  };

  const calculateWeight = (
    itemType: ItemType,
    standard: string,
    material: Material,
    size: string,
    scheduleOrClass: string,
    lengthOrQuantity: number
  ): number => {
    const items = getItemData(itemType);
    const config = ITEM_CONFIGS[itemType];

    if (config.calculationType === 'density') {
      const item = items.find(
        (i: any) =>
          i.standard === standard &&
          (Array.isArray(i.materialId) ? i.materialId.includes(material.id) : i.materialId === material.id) &&
          i.sizes?.[size] && (
            i.sizes[size][scheduleOrClass] || 
            Object.keys(i.sizes[size]).some(key => key.includes(',') && key.split(',').includes(scheduleOrClass))
          )
      );

      if (!item) return 0;

      if (itemType === 'pipe') {
        return calculatePipeWeight(item as any, size, scheduleOrClass, lengthOrQuantity, material.id);
      } else if (itemType === 'elbow') {
        return calculateElbowWeight(item as any, size, scheduleOrClass, lengthOrQuantity, material.id);
      }
    } else if (config.calculationType === 'weight') {
      const valve = items.find(
        (v: any) =>
          v.standard === standard &&
          v.materialId === material.id &&
          v.size === size
      );

      if (valve) {
        return calculateValveWeight(valve as any, scheduleOrClass, lengthOrQuantity);
      }
    }

    return 0;
  };

  return {
    getItemData,
    calculateWeight,
  };
}