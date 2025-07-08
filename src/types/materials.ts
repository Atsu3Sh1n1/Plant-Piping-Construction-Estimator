// --- 型定義 ---

// 材料型
export interface Material {
  id: string;
  name: string;
  density: number;
}

// JIS配管サイズ（代表例）
export type JISSize =
  | '1A' | '2A' | '3A' | '4A' | '5A' | '6A' | '8A' | '10A' | '15A' | '20A' | '25A'
  | '32A' | '40A' | '50A' | '65A' | '80A' | '100A' | '125A' | '150A' | '200A'
  | '250A' | '300A' | '350A' | '400A' | '450A' | '500A' | '600A' | '700A'
  | '750A' | '800A' | '900A' | '1000A' | '1100A' | '1200A' | '1300A' | '1400A'
  | '1500A' | '1600A' | '1700A' | '1800A' | '1900A' | '2000A';

// ASTMインチサイズ（代表例）
export type ASTMSize =
  | '1/8' | '1/4' | '3/8' | '1/2' | '3/4' | '1' | '1-1/4' | '1-1/2' | '2' | '2-1/2' | '3' | '4'
  | '5' | '6' | '8' | '10' | '12' | '14' | '16' | '18' | '20' | '24';

// Schedule別の寸法定義
export interface ScheduleDimension {
  od: number;       // 外径 (mm)
  t: number;        // 肉厚 (mm)
  density?: number; // 任意で材質ごとに上書き密度
}

// JISまたはASTMどちらかの種別
export type SizeType = 'JIS' | 'ASTM';
export type PipeSize = JISSize | ASTMSize;

// Pipe型：サイズを複数持たせる構造
export interface Pipe {
  id: string;
  standard: string;
  materialId: string | string[]; // 単一または複数材質対応
  sizeType: SizeType; // 'JIS' or 'ASTM'
  sizes: {
    [size: string]: {
      [schedule: string]: ScheduleDimension;
    };
  };
}

// ScheduleDimensionを拡張してbendRadiusを追加
export interface ElbowScheduleDimension extends ScheduleDimension {
  bendRadius: number; // 曲げ半径(mm)
}

// Elbow型もsizesの中のScheduleDimensionをElbowScheduleDimensionに変更
export interface Elbow extends Pipe {
  angle: number;
  sizes: {
    [size: string]: {
      [schedule: string]: ElbowScheduleDimension;
    };
  };
}

// Valve型：従来通り
export interface Valve {
  id: string;
  name: string;
  standard: string;
  materialId: string;
  size: string;
  class: {
    [className: string]: {
      weight: number;
    };
  };
}

// Bolt型：従来通り
export interface Bolt {
  id: string;
  name: string;
  standard: string;
  materialId: string;
  size: string;
  class: {
    [className: string]: {
      weight: number;
    };
  };
}

// 全部をまとめたアイテム型
export type ItemType = Pipe | Valve | Bolt | Elbow;