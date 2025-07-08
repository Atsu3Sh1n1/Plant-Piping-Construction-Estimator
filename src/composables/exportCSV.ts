interface RowData {
  type: string;
  standard: string;
  material: string;
  size: string;
  scheduleOrClass: string;
  lengthOrQuantity: number;
  weight: number;
}

export function exportToCSV(data: RowData[], filename: string = 'estimate') {
  const headers = ['Type', 'Standard', 'Material', 'Size', 'Schedule/Class', 'Length/Quantity', 'Weight'];
  const rows = data.map(row => [
    row.type,
    row.standard,
    row.material,
    row.size,
    row.scheduleOrClass,
    row.lengthOrQuantity,
    row.weight,
  ]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `${filename}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}