// アイテムタイプの定義
export type ItemType = 'pipe' | 'elbow' | 'valve';

// 入力タイプの定義
export type InputType = 'length' | 'quantity';

// 計算タイプの定義
export type CalculationType = 'density' | 'weight';

// アイテム設定
export interface ItemConfig {
  inputType: InputType;
  calculationType: CalculationType;
  hasSchedule: boolean;
  hasClass: boolean;
}

// アイテム設定マップ
export const ITEM_CONFIGS: Record<ItemType, ItemConfig> = {
  pipe: {
    inputType: 'length',
    calculationType: 'density',
    hasSchedule: true,
    hasClass: false,
  },
  elbow: {
    inputType: 'quantity',
    calculationType: 'density',
    hasSchedule: true,
    hasClass: false,
  },
  valve: {
    inputType: 'quantity',
    calculationType: 'weight',
    hasSchedule: false,
    hasClass: true,
  },
};