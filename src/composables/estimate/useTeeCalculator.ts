import { tees } from '@/data/materials/tees';

export const teesCalculator = {
  items: tees,
  // 仮の重量計算（要仕様に応じて修正）
  getWeight(id: string): number {
    const tee = tees.find(t => t.id === id);
    if (!tee) return 0;
    return 7.0;
  },
};
