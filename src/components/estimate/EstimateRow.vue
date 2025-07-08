<template>
  <div class="estimate-row">
    <select v-model="selectedType" @change="resetSelections" class="select-type">
      <option disabled value="">Select Type</option>
      <option value="pipe">Pipe</option>
      <option value="valve">Valve</option>
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
      v-if="selectedType === 'pipe'"
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
      v-if="selectedType === 'valve'"
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

    <!-- パイプの長さ入力 -->
    <div v-if="selectedType === 'pipe'" class="length-input-group">
      <input
        type="number"
        v-model.number="lengthValue"
        placeholder="Length"
        min="0"
        step="0.01"
        @input="calculateWeight"
        :disabled="!selectedSchedule"
        class="input-length"
      />
      <select v-model="sharedUnit" @change="calculateWeight" :disabled="!selectedSchedule" class="select-unit">
        <option value="m">m</option>
        <option value="ft">ft</option>
      </select>
      <div class="converted-display">
        = {{ convertedValue.toFixed(3) }} <span>{{ sharedUnit === 'm' ? 'ft' : 'm' }}</span>
      </div>
    </div>

    <!-- バルブの個数入力 -->
    <input
      v-if="selectedType === 'valve'"
      type="number"
      v-model.number="quantity"
      placeholder="Quantity"
      min="0"
      step="1"
      @input="calculateWeight"
      :disabled="!selectedClass"
      class="input-quantity"
    />

    <span class="weight-display">{{ weight.toFixed(3) }} kg</span>
  </div>
</template>

<script setup lang="ts">
import { useEstimateRow } from '@/composables/estimate/useEstimateRow';
import { injectUnit } from '@/composables/estimate/useSharedUnit';
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

defineExpose({ getRowData });
</script>
