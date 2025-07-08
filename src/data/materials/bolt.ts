export interface BoltSize {
  weight: number;
}
export interface Bolt {
  id: string;
  standard: string;
  materialId: string;
  size: string;
  sizes: Record<string, BoltSize>;
}
export const bolts: Bolt[] = [
  { id: 'BOLT1', standard: 'JIS', materialId: 'SUS304', size: 'M10', sizes: { 'Class1': { weight: 0.1 } } },
];