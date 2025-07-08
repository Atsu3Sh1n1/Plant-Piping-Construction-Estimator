<template>
  <div class="app">
    <h1>Pipe Weight Estimator</h1>
    <EstimateSheet />
  </div>
</template>

<script setup lang="ts">
import EstimateSheet from './components/estimate/EstimateSheet.vue';
</script>

<style scoped>
.app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>