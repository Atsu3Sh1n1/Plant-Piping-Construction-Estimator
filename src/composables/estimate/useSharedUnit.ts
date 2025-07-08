import { ref, provide, inject, type Ref } from 'vue';

const UNIT_KEY = Symbol('unit');

export function provideUnit() {
  const unit = ref<'m' | 'ft'>('m');
  provide(UNIT_KEY, unit);
  return unit;
}

export function injectUnit(): Ref<'m' | 'ft'> {
  const unit = inject<Ref<'m' | 'ft'>>(UNIT_KEY);
  if (!unit) {
    throw new Error('Unit not provided');
  }
  return unit;
}