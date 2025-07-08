import { Valve } from '@/types/materials';

export const valves: Valve[] = [
  {
    id: "100A(BB)",
    name: "100A Butterfly Valve",
    
    standard: "JIS",
    materialId: "SUS",
    size: "100A", 
    class: {
      "10-DGF-N(BB) 10K": { weight: 37 },
      "16-DGF-N(BB) 16K": { weight: 39.0 },
      "20-DGF-N(BB) 20K": { weight: 56 },
    },
  },
];
