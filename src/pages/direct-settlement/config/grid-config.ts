import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';
import CustomFilter from '@/components/modules/select-filter';
import { STATUS_BADGE, PAYMENT_BADGE } from '@/constants/badge';

const paymentRenderer = createBadgeRenderer(PAYMENT_BADGE);

export const companyColumnDefs: ColDef[] = [
  { headerName: 'ID', field: 'buy_company_id', flex: 0.3, cellStyle: { textAlign: 'center' } },
  {
    headerName: '매입사명',
    field: 'b_nm',
    headerClass: '',
    flex: 1,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'type',
    flex: 0.5,
    headerName: '결제일',
    sortable: false,
    filter: CustomFilter,
    floatingFilter: false,
    cellRenderer: paymentRenderer,
    cellStyle: { textAlign: 'center' },
  },
];

const statusRenderer = createBadgeRenderer(STATUS_BADGE);

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

  rowModelType: 'infinite',
  cacheBlockSize: 50,
  cacheOverflowSize: 2, // 캐시 오버플로우 크기
  maxConcurrentDatasourceRequests: 1, // 동시 요청 수를 1로 줄임
  infiniteInitialRowCount: 1, // 초기 행 수를 1로 설정
  maxBlocksInCache: 10, // 캐시에 유지할 최대 블록 수

  onModelUpdated: (event) => {
    setTimeout(() => {
      if (event.api) event.api.autoSizeAllColumns();
    });
  },
  onRowDataUpdated: (event) => {
    setTimeout(() => {
      if (event.api) event.api.autoSizeAllColumns();
    }, 100);
  },
  onFirstDataRendered: (event) => {
    setTimeout(() => {
      if (event.api) event.api.autoSizeAllColumns();
    }, 100);
  },
};
