<template>
  <div class="estimate-sheet">
    <button class="export-btn" @click="exportCSV">Export CSV</button>
    <EstimateRow v-for="(row, index) in rows" :key="index" ref="estimateRows" />

    <div class="add-row-center">
      <button class="add-row-btn" @click="addRow">Add Row</button>
    </div>

    <div class="total-weight-display">
      Total Weight: {{ totalWeight.toFixed(2) }} kg
    </div>
    <div class="total-man-days-display">
      Total person-day (adjusted): {{ adjustedManDays.toFixed(2) }} day
    </div>

    <!-- 作業床高さ入力（単位切替付き） -->
    <div class="height-input-group">
      <label for="workHeight">Work Height Factor:</label>
      <input id="workHeight" type="number" v-model.number="workHeightValue" min="0" step="0.1" :disabled="false" />
      <select v-model="workHeightUnit" @change="onHeightUnitChange">
        <option value="m">m</option>
        <option value="ft">ft</option>
      </select>
      <div class="converted-display">
        = {{ convertedWorkHeight.toFixed(3) }} {{ workHeightUnit === 'm' ? 'ft' : 'm' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EstimateRow from './EstimateRow.vue';
import { exportToCSV } from '@/composables/exportCSV';
import './EstimateSheet.css';
import { useHeightCoefficient } from '@/composables/estimate/useHeightCoefficient';
import { provideUnit } from '@/composables/estimate/useSharedUnit';

const rows = ref([{}]);
const estimateRows = ref<InstanceType<typeof EstimateRow>[]>([]);

const addRow = () => {
  rows.value.push({});
};

const exportCSV = () => {
  const data = estimateRows.value.map(row => row.getRowData());
  exportToCSV(data);
};

// 総重量計算
const totalWeight = computed(() => {
  if (!estimateRows.value.length) return 0;
  return estimateRows.value.reduce((sum, row) => {
    const data = row?.getRowData?.();
    if (!data) return sum;
    return sum + (data.weight || 0);
  }, 0);
});

// 1kgあたりの人日係数（固定）
const manDayPerKg = 0.025;

// 作業床高さ入力と単位管理
const workHeightValue = ref(0);
const workHeightUnit = ref<'m' | 'ft'>('m');

// 共有単位を提供
provideUnit();

// 作業床高さの単位切替時に値を変換（フィート→メートルまたはメートル→フィート）
const onHeightUnitChange = () => {
  if (workHeightUnit.value === 'm') {
    // ft → m に変換
    workHeightValue.value = parseFloat((workHeightValue.value * 0.3048).toFixed(3));
  } else {
    // m → ft に変換
    workHeightValue.value = parseFloat((workHeightValue.value / 0.3048).toFixed(3));
  }
};

// 入力値に対する反対単位の値を計算表示
const convertedWorkHeight = computed(() =>
  workHeightUnit.value === 'm'
    ? workHeightValue.value / 0.3048
    : workHeightValue.value * 0.3048
);

// useHeightCoefficientからheightCoefficientを取得
const { heightCoefficient } = useHeightCoefficient(workHeightValue, workHeightUnit);

// 調整済み人日計算
const adjustedManDays = computed(() => totalWeight.value * manDayPerKg * heightCoefficient.value);
</script>

