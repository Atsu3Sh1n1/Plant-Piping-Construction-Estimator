import type { Elbow } from '@/types/materials';

export const elbows: Elbow[] = [
  {
    id: 'elbow-jis-90',
    standard: 'JIS B2313',
    materialId: ['CS', 'SUS304', 'SUS316', 'GOLD-24K'],
    sizeType: 'JIS',
    angle: 90,
    sizes: {
      '100A': {
        'Sch40,Sch40s': { od: 114.3, t: 6.0, bendRadius: 152.4 },
        'Sch80,Sch80s': { od: 114.3, t: 8.6, bendRadius: 152.4 }
      },
    }
  }
];