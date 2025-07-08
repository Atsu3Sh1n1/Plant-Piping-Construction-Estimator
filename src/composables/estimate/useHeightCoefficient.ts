import { computed, Ref } from 'vue';

export const useHeightCoefficient = (workHeightValue: Ref<number>, workHeightUnit: Ref<'m' | 'ft'>) => {
  const getHeightCoefficient = (height: number): number => {
    const table = [
      { height: 0, coefficient: 1.0 },
      { height: 10, coefficient: 1.34 },
      { height: 20, coefficient: 1.71 },
      { height: 30, coefficient: 2.04 },
      { height: 60, coefficient: 3.24 },
      { height: 100, coefficient: 5.26 },
      { height: 150, coefficient: 7.16 },
      { height: 200, coefficient: 8.0 },
    ];
    if (height <= 0) return 1.0;
    if (height >= 200) return 8.0;
    for (let i = 0; i < table.length - 1; i++) {
      const h1 = table[i].height,
        h2 = table[i + 1].height;
      const c1 = table[i].coefficient,
        c2 = table[i + 1].coefficient;
      if (height >= h1 && height <= h2) {
        const ratio = (height - h1) / (h2 - h1);
        return parseFloat((c1 + (c2 - c1) * ratio).toFixed(2));
      }
    }
    return 1.0;
  };

  const heightCoefficient = computed(() => {
    const heightInMeters = workHeightUnit.value === 'm' ? workHeightValue.value : workHeightValue.value * 0.3048;
    return getHeightCoefficient(heightInMeters);
  });

  return {
    heightCoefficient,
  };
};
