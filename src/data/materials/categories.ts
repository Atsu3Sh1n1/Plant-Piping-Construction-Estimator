// src/data/materials/categories.ts

// アイテム種別一覧（ここに増やすだけで全体反映）
export const itemTypes = [
  'pipe',
  'valve',
  'flange',
  'bolt',
  'elbow',
  'tee',
  'cap',
  // ...最大100種
] as const;

export type ItemType = (typeof itemTypes)[number];

// 規格一覧（例としてJIS, ASTM, DINなど）
export const standards = [
  'JIS',
  'ASTM',
  'DIN',
  'API',
  // 必要に応じて追加してください
] as const;

export type Standard = (typeof standards)[number];
