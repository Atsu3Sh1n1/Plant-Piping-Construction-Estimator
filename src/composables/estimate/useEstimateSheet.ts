import { ref } from 'vue';
import type { EstimateRow } from '@/types/estimate';
import { v4 as uuidv4 } from 'uuid';

export function useEstimateSheet() {
  const rows = ref<EstimateRow[]>([
    {
      id: uuidv4(),
      type: 'pipe',
      itemId: 'SGP',
      scheduleOrSize: 'Sch40',
      length: 1,
      quantity: 1,
      weight: 0,
    },
  ]);

  function addRow() {
    rows.value.push({
      id: uuidv4(),
      type: 'pipe',
      itemId: 'SGP',
      scheduleOrSize: 'Sch40',
      length: 1,
      quantity: 1,
      weight: 0,
    });
  }

  function updateRow(updatedRow: EstimateRow) {
    const index = rows.value.findIndex((row) => row.id === updatedRow.id);
    if (index !== -1) {
      rows.value[index] = updatedRow;
    }
  }

  function removeRow(id: string) {
    rows.value = rows.value.filter((row) => row.id !== id);
  }

  return { rows, addRow, updateRow, removeRow };
}