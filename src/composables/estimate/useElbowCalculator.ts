import type { Elbow } from '@/types/materials';
import { materials } from '@/data/materials/materials';

export function useElbowCalculator() {
  const calculateElbowWeight = (
    elbow: Elbow,
    size: string,
    schedule: string,
    quantity: number,
    materialId: string
  ): number => {
    // Find the schedule data, handling comma-separated keys
    let sizeData;
    const sizeObj = elbow.sizes[size];
    if (!sizeObj) return 0;
    
    // Look for exact match first
    if (sizeObj[schedule]) {
      sizeData = sizeObj[schedule];
    } else {
      // Look for comma-separated key that contains the schedule
      const matchingKey = Object.keys(sizeObj).find(key => 
        key.includes(',') && key.split(',').includes(schedule)
      );
      if (matchingKey) {
        sizeData = sizeObj[matchingKey];
      }
    }
    
    if (!sizeData) return 0;

    const material = materials.find(m => m.id === materialId);
    if (!material) return 0;

    const { od, t, bendRadius } = sizeData;
    const density = sizeData.density || material.density;

    // エルボの重量計算：曲げ部分の体積を計算
    // 曲げ角度をラジアンに変換
    const angleRad = (elbow.angle * Math.PI) / 180;
    
    // 中心線長さ = 曲げ半径 × 角度(ラジアン)
    const centerlineLength = bendRadius * angleRad;
    
    // パイプの断面積 = π × ((外径/2)² - (内径/2)²)
    const id = od - 2 * t; // 内径
    const crossSectionArea = Math.PI * ((od/2)**2 - (id/2)**2);
    
    // 体積 = 断面積 × 中心線長さ
    const volume = crossSectionArea * centerlineLength;
    
    // 重量 = 体積 × 密度 × 個数
    // 密度をg/cm³からkg/m³に変換 (×1000)、体積をmm³からm³に変換 (÷1000000000)
    const weight = (volume / 1000000000) * (density * 1000) * quantity;
    
    return weight;
  };

  return {
    calculateElbowWeight,
  };
}