import { type ColDef } from 'ag-grid-community';

export function createBadgeRenderer(
  colorMap: Record<string, string | { className: string; text: string }>,
) {
  return (params: any) => {
    const value: string = params.value;
    const config = colorMap[value];

    if (typeof config === 'object' && config.className && config.text) {
      return <span className={`badge ${config.className}`}>{config.text}</span>;
    }

    return <span className={`badge ${config || ''}`}>{value}</span>;
  };
}

export function createTypeRenderer() {
  return (params: any) => {
    const value: string = params.value;

    if (!value) return <></>;

    return (
      <span
        className={`border-border/50 bg-background text-contrast rounded-sm border p-[6px] text-xs`}
      >
        {value}
      </span>
    );
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
