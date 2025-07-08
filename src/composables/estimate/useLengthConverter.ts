import { ref, computed, type Ref } from 'vue';

interface UseLengthConverterOptions {
  units?: string[];
  toMeterFactor?: number;
  unit?: Ref<string>;
}

export function useLengthConverter(options?: UseLengthConverterOptions) {
  const units = options?.units ?? ['m', 'inch'];
  const toMeterFactor = options?.toMeterFactor ?? 0.0254;

  const lengthValue = ref(0);
  const unit = options?.unit ?? ref<string>(units[0]);

  // 反対単位の値を計算
  const convertedValue = computed(() => {
    if (unit.value === units[0]) {
      // 単位が基準単位の場合（mなど）
      return lengthValue.value / toMeterFactor;
    } else {
      // 単位が換算単位の場合（ftなど）
      return lengthValue.value * toMeterFactor;
    }
  });

  return {
    lengthValue,
    ...(options?.unit ? {} : { unit }),
    convertedValue,
    units,
  };
}
