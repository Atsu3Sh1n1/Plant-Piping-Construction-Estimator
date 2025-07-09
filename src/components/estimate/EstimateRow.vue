<template>
  <div class="estimate-row">
    <select v-model="selectedType" @change="resetSelections" class="select-type">
      <option disabled value="">Select Type</option>
      <option v-for="(config, type) in itemConfigs" :key="type" :value="type">
        {{ type.charAt(0).toUpperCase() + type.slice(1) }}
      </option>
    </select>

    <select v-model="selectedStandard" @change="updateMaterialOptions" :disabled="!selectedType" class="select-standard">
      <option disabled value="">Select Standard</option>
      <option v-for="standard in availableStandards" :key="standard" :value="standard">{{ standard }}</option>
    </select>

    <select v-model="selectedMaterial" @change="updateSizeOptions" :disabled="!selectedStandard" class="select-material">
      <option disabled :value="null">Select Material</option>
      <option v-for="material in availableMaterials" :key="material.id" :value="material">
        {{ material.id }}
      </option>
    </select>

    <select v-model="selectedSize" @change="updateScheduleOrClassOptions" :disabled="!selectedMaterial" class="select-size">
      <option disabled value="">Select Size</option>
      <option v-for="size in availableSizes" :key="size" :value="size">{{ size }}</option>
    </select>

    <select
      v-if="currentConfig?.hasSchedule"
      v-model="selectedSchedule"
      @change="calculateWeight"
      :disabled="!selectedSize"
      class="select-schedule"
    >
      <option disabled value="">Select Schedule</option>
      <option v-for="schedule in availableSchedules" :key="schedule" :value="schedule">
        {{ schedule }}
      </option>
    </select>

    <select
      v-if="currentConfig?.hasClass"
      v-model="selectedClass"
      @change="calculateWeight"
      :disabled="!selectedSize"
      class="select-class"
    >
      <option disabled value="">Select Class</option>
      <option v-for="className in availableClasses" :key="className" :value="className">
        {{ className }}
      </option>
    </select>

    <!-- 長さ入力 -->
    <div v-if="currentConfig?.inputType === 'length'" class="length-input-group">
      <input
        type="number"
        v-model.number="lengthValue"
        placeholder="Length"
        min="0"
        step="0.01"
        @input="calculateWeight"
        :disabled="!isInputEnabled"
        class="input-length"
      />
      <select v-model="sharedUnit" @change="calculateWeight" :disabled="!isInputEnabled" class="select-unit">
        <option value="m">m</option>
        <option value="ft">ft</option>
      </select>
      <div class="converted-display">
        = {{ convertedValue.toFixed(3) }} <span>{{ sharedUnit === 'm' ? 'ft' : 'm' }}</span>
      </div>
    </div>

    <!-- 個数入力 -->
    <input
      v-if="currentConfig?.inputType === 'quantity'"
      type="number"
      v-model.number="quantity"
      placeholder="Quantity"
      min="0"
      step="1"
      @input="calculateWeight"
      :disabled="!isInputEnabled"
      class="input-quantity"
    />

    <span class="weight-display">{{ weight.toFixed(3) }} kg</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEstimateRow } from '@/composables/estimate/useEstimateRow';
import { injectUnit } from '@/composables/estimate/useSharedUnit';
import { ITEM_CONFIGS } from '@/types/itemTypes';
import './EstimateRow.css';

const sharedUnit = injectUnit();

const {
  selectedType,
  selectedStandard,
  selectedMaterial,
  selectedSize,
  selectedSchedule,
  selectedClass,
  quantity,
  weight,
  lengthValue,
  convertedValue,
  availableStandards,
  availableMaterials,
  availableSizes,
  availableSchedules,
  availableClasses,
  resetSelections,
  updateMaterialOptions,
  updateSizeOptions,
  updateScheduleOrClassOptions,
  calculateWeight,
  getRowData,
} = useEstimateRow(sharedUnit);

const itemConfigs = ITEM_CONFIGS;
const currentConfig = computed(() => selectedType.value ? ITEM_CONFIGS[selectedType.value as keyof typeof ITEM_CONFIGS] : null);
const isInputEnabled = computed(() => {
  if (!currentConfig.value) return false;
  return currentConfig.value.hasClass ? !!selectedClass.value : !!selectedSchedule.value;
});

defineExpose({ getRowData });
</script>
