import type { Pipe } from '@/types/materials';
import { materials } from '@/data/materials/materials';

export function usePipeCalculator() {
  // 材質IDから密度を取得
  const getDensity = (materialId: string): number => {
    const material = materials.find(m => m.id === materialId);
    console.log("materialId:", materialId, "→ density:", material?.density);
    return material?.density ?? 7.85;
  };

  // パイプ重量計算（sizeとscheduleを指定）
  const calculatePipeWeight = (
    pipe: Pipe,
    size: string,
    schedule: string,
    length: number,     // m単位
    materialId: string
  ): number => {
    const sizeInfo = pipe.sizes[size];
    if (!sizeInfo) return 0;

    const sch = sizeInfo[schedule];
    if (!sch) return 0;

    const { od, t } = sch;
    const rOuter = od / 2;
    const rInner = rOuter - t;

    const volume = Math.PI * (rOuter ** 2 - rInner ** 2) * (length * 1000); // mm³
    const volume_cm3 = volume / 1000;

    const density = sch.density ?? getDensity(materialId); // g/cm³
    const weight_kg = volume_cm3 * density / 1000;

    return Number(weight_kg.toFixed(3));
  };

  // 使用可能スケジュール一覧取得（材質に応じてS/非S分岐）
  const getAvailableSchedules = (pipe: Pipe, size: string): string[] => {
    const sizeInfo = pipe.sizes[size];
    if (!sizeInfo) return [];

    const ids = Array.isArray(pipe.materialId) ? pipe.materialId : [pipe.materialId];
    const isStainless = ids.some(id => id.toLowerCase().includes('sus'));

    return Object.keys(sizeInfo).filter(schedule =>
      isStainless ? schedule.toLowerCase().endsWith('s') : !schedule.toLowerCase().endsWith('s')
    );
  };

  return {
    calculatePipeWeight,
    getDensity,
    getAvailableSchedules,
  };
}
