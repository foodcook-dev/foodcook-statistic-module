import { type ColDef } from 'ag-grid-community';

export function createBadgeRenderer(colorMap: Record<string, string>) {
  return (params: any) => {
    const value: string = params.value;
    return <span className={`badge ${colorMap[value] || ''}`}>{value}</span>;
  };
}

export function createNumericColumn(
  field: string,
  headerName: string,
  options: Partial<ColDef> = {},
) {
  return {
    field,
    headerName,
    type: 'numericColumn',
    valueFormatter: (params: any) => {
      if (params.value == null) return '';
      return params.value.toLocaleString();
    },
    ...options,
  };
}

export function getNegativeValueStyle(params: any) {
  return params.value < 0 ? { color: 'red' } : null;
}
