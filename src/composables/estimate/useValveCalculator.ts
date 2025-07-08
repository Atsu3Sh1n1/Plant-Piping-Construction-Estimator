import type { Valve } from '@/types/materials';

export function useValveCalculator() {
  const calculateValveWeight = (
    valve: Valve,
    className: string,
    quantity: number
  ): number => {
    const weight = valve.class[className]?.weight ?? 0;
    return Number((weight * quantity).toFixed(2));
  };

  return { calculateValveWeight };
}
