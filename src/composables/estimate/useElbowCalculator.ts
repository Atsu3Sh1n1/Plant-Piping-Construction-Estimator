// composables/estimate/useElbowCalculator.ts
import type { Elbow } from '@/types/materials';
import { materials } from '@/data/materials/materials';

export function useElbowCalculator() {
  // 材質IDから密度取得
  const getDensity = (materialId: string): number => {
    const material = materials.find(m => m.id === materialId);
    return material?.density ?? 7.85;
  };

  /**
   * エルボ重量計算
   * @param elbow Elbow型
   * @param size サイズ文字列（例: '100A'）
   * @param schedule スケジュール文字列（例: 'FSGP'）
   * @param materialId 材質ID
   * @returns 重量(kg)
   */
  const calculateElbowWeight = (
    elbow: Elbow,
    size: string,
    schedule: string,
    materialId: string
  ): number => {
    const sizeInfo = elbow.sizes[size];
    if (!sizeInfo) return 0;

    const sch = sizeInfo[schedule];
    if (!sch) return 0;

    const { od, t, bendRadius } = sch;
    const rOuter = od / 2;
    const rInner = rOuter - t;

    // 断面積 (mm²)
    const crossSectionArea = Math.PI * (rOuter ** 2 - rInner ** 2);

    // 曲げ角度をラジアンに変換
    const angleRad = (elbow.angle * Math.PI) / 180;

    // 中心線長さ (mm)
    const centerLineLength = angleRad * bendRadius;

    // 体積 mm³ = 断面積 × 中心線長さ
    const volume = crossSectionArea * centerLineLength;

    // 材質密度 (g/cm³) ※sch.density優先
    const density = sch.density ?? getDensity(materialId);

    // 体積を cm³ に変換 (1 mm³ = 0.001 cm³)
    const volume_cm3 = volume * 0.001;

    // 重量 kg = 体積(cm³) × 密度(g/cm³) ÷ 1000
    const weight_kg = (volume_cm3 * density) / 1000;

    return Number(weight_kg.toFixed(3));
  };

  return {
    calculateElbowWeight,
    getDensity,
  };
}
