export interface Material {
  id: string;
  name: string;
  density: number; // g/cm³
}

export interface Pipe {
  id: string;
  standard: string;
  materialId: string;
  size: string;
  schedules: {
    [key: string]: {
      od: number; // mm
      t: number; // mm
    };
  };
}

export interface Valve {
  id: string;
  name: string;
  standard: string;
  materialId: string;
  sizes: {
    [key: string]: {
      weight: number; // kg
    };
  };
}

export type ItemType = 'pipe' | 'valve';