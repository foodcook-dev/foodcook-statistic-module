import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';
import { TEMP_BADGE } from '../structure';

const statusRenderer = createBadgeRenderer(TEMP_BADGE);

export const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'ID', field: 'detail_id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  {
    headerName: '전표상태',
    field: 'type',
    pinned: 'left',
    cellStyle: { textAlign: 'center' },
    cellRenderer: statusRenderer,
  },
  { headerName: '처리일자', field: 'process_date', pinned: 'left' },
  {
    headerName: '매입정보',
    headerStyle: { backgroundColor: 'rgb(255 133 98)' },
    children: [
      createNumericColumn('purchase_amount', '매입액', {
        cellStyle: (params) => {
          const baseStyle = { backgroundColor: 'rgb(255 247 220)' };
          return params.value < 0 ? { ...baseStyle, color: 'red' } : baseStyle;
        },
      }),
    ],
  },
  {
    headerName: '결제정보',
    headerStyle: { backgroundColor: 'rgb(255 131 100)' },
    children: [
      createNumericColumn('discount_amount', '결제 차감액[할인]'),
      createNumericColumn('payment_amount', '결제 완료액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
      createNumericColumn('invoice_total', '계산서발행 총액'),
    ],
  },
  createNumericColumn('balance', '잔액', {
    headerStyle: { backgroundColor: 'rgb(237 76 36)' },
    cellStyle: (params) => {
      const baseStyle = { backgroundColor: 'rgb(253 255 217)' };
      return params.value < 0 ? { ...baseStyle, color: 'red' } : baseStyle;
    },
  }),
  { headerName: '비고', field: 'memo', minWidth: 200 },
];

export const gridOptions: GridOptions = {
  defaultColGroupDef: { headerClass: 'centered' },
  defaultColDef: { headerClass: 'centered' },
  columnDefs: columnDefs,
  autoSizeStrategy: {
    type: 'fitCellContents',
  },
  onGridReady: (event) => {
    event.api.sizeColumnsToFit();
  },
  onModelUpdated: (event) => {
    event.api.autoSizeAllColumns();
  },
};
