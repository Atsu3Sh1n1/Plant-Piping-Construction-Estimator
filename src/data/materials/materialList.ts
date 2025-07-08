export interface Material {
  id: string
  name: string
  density: number // kg/m³
}

export const materials: Material[] = [
  { id: 'SGP', name: 'Steel Pipe', density: 7.850 },
  { id: 'A106B', name: 'Carbon Steel A106B', density: 7.850 },
  { id: 'SUS304', name: 'Stainless Steel 304', density: 7.930 },
  { id: 'SUS', name: 'Stainless Steel 304', density: 7.930 },

  { id: 'SUS316', name: 'Stainless Steel 316', density: 8.000 },
]