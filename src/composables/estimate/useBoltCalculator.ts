import { bolts, type Bolt } from '@/data/materials/bolt';
export const boltCalculator = {
  items: bolts,
  filterItems(selectedStandard?: string, materialId?: string): Bolt[] {
    return this.items.filter(b => {
      if (selectedStandard && b.standard !== selectedStandard) return false;
      if (materialId && b.materialId !== materialId) return false;
      return true;
    });
  },
  getWeight(id: string, size?: string): number {
    const bolt = this.items.find(b => b.id === id);
    if (!bolt) return 0;
    const sizeKey = size && bolt.sizes[size] ? size : Object.keys(bolt.sizes)[0];
    return bolt.sizes[sizeKey]?.weight ?? 0;
  },
  getSubOptionName: () => 'Class',
};