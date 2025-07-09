export interface Material {
  id: string;
  name: string;
  density: number; // 比重 (kg/m³)
}

export const materials: Material[] = [
  // 鋼材・ステンレス
  { id: 'SGP', name: 'Steel Pipe', density: 7.850 },
  { id: 'A106B', name: 'Carbon Steel A106B', density: 7.850 },
  { id: 'SUS304', name: 'Stainless Steel 304', density: 7.930 },
  { id: 'SUS', name: 'Stainless Steel 304', density: 7.930 },

  { id: 'SUS316', name: 'Stainless Steel 316', density: 8.000 },
  { id: 'SUS310S', name: 'Stainless Steel 310S', density: 7.990 },
  { id: 'CS', name: 'Carbon Steel', density: 7.85 },

  // 貴金属
  { id: 'GOLD-24K', name: 'Gold 24K', density: 19.32 },
  { id: 'GOLD22K', name: 'Gold 22K', density: 17.90 },
  { id: 'GOLD18K', name: 'Gold 18K', density: 15.58 },
  { id: 'GOLD14K', name: 'Gold 14K', density: 13.30 },
  { id: 'GOLD10K', name: 'Gold 10K', density: 11.50 },

  { id: 'PT1000', name: 'Platinum 1000', density: 21.45 },
  { id: 'PT950', name: 'Platinum 950', density: 21.30 },
  { id: 'PT900', name: 'Platinum 900', density: 21.15 },

  { id: 'SILVER999', name: 'Silver 999', density: 10.49 },
  { id: 'SILVER925', name: 'Silver 925', density: 10.36 },

  // その他一般金属・合金
  { id: 'COPPER', name: 'Copper', density: 8.96 },
  { id: 'BRASS', name: 'Brass', density: 8.50 },
  { id: 'ALUMINUM', name: 'Aluminum', density: 2.70 },
  { id: 'TIN', name: 'Tin', density: 7.31 },           // スズ
  { id: 'TI', name: 'Titanium', density: 4.50 },      // チタン
  { id: 'NICKEL', name: 'Nickel', density: 8.90 },
];

// src\data\materials\materials.ts