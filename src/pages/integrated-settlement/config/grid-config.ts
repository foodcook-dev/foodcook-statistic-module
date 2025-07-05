import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';
import { TYPE_BADGE, PAYMENT_BADGE } from '@/constants/badge';

const typeRenderer = createBadgeRenderer(TYPE_BADGE);
const paymentRenderer = createBadgeRenderer(PAYMENT_BADGE);

const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'ID', field: 'company_id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  { headerName: '매입사명', field: 'b_nm', pinned: 'left', filter: 'agTextColumnFilter' },
  {
    field: 'type',
    headerName: '매입 유형',
    cellRenderer: typeRenderer,
    cellStyle: { textAlign: 'center' },
  },
  {
    field: 'payment_date',
    headerName: '결제일',
    cellRenderer: paymentRenderer,
    cellStyle: { textAlign: 'center' },
  },
  { headerName: '사업자번호', field: 'b_no', filter: 'agTextColumnFilter' },
  createNumericColumn('previous_balance', '전기이월액'),
  createNumericColumn('sales_amount', '매출액', { headerStyle: { backgroundColor: '#ff7b54' } }),
  {
    headerName: '매입정보',
    headerStyle: { backgroundColor: 'rgb(255 133 98)' },
    children: [
      createNumericColumn('tax_purchase', '매입 과세액', {
        columnGroupShow: 'open',
        cellStyle: { backgroundColor: 'rgb(239 239 239)' },
      }),
      createNumericColumn('tax_free_purchase', '매입 면세액', {
        columnGroupShow: 'open',
        cellStyle: { backgroundColor: 'rgb(239 239 239)' },
      }),
      createNumericColumn('purchase_amount', '매입액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
    ],
  },
  {
    headerName: '정산정보',
    headerStyle: { backgroundColor: 'rgb(255 147 117)' },
    children: [
      createNumericColumn('commission_rate', '정산 수수료(%)', {
        columnGroupShow: 'open',
        cellStyle: { textAlign: 'right' },
      }),
      createNumericColumn('app_fee', '앱 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('other_fee', '기타 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('expected_settlement', '정산 예정액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
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
    minWidth: 180,
    pinned: 'right',
    headerStyle: { backgroundColor: 'rgb(255 252 151)', color: 'red' },
    cellStyle: { backgroundColor: 'rgb(253 255 217)', color: 'red', fontWeight: 'bold' },
  }),
  {
    headerName: '최종 매입일',
    field: 'last_purchase_date',
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: '최종 결제일',
    field: 'last_payment_date',
    cellStyle: { textAlign: 'right' },
  },
  createNumericColumn('total_product_inventory_value', '상품재고액(전일자 기준)'),
  { headerName: '전자 세금계산서', field: 'tax_invoice_email' },
  { headerName: '비고', field: 'memo' },
];

export const gridOptions: GridOptions = {
  defaultColGroupDef: { headerClass: 'centered' },
  defaultColDef: { headerClass: 'centered' },
  columnDefs: columnDefs,

  rowModelType: 'infinite',
  cacheBlockSize: 50,
  cacheOverflowSize: 2,
  maxConcurrentDatasourceRequests: 1,
  infiniteInitialRowCount: 1,
  maxBlocksInCache: 10,

  // onGridReady: (event) => {
  //   event.api.autoSizeAllColumns();
  // },
  onColumnGroupOpened: (event) => {
    event.api.autoSizeAllColumns();
  },

  onModelUpdated: (event) => {
    setTimeout(() => {
      if (event.api) {
        const firstRowNode = event.api.getDisplayedRowAtIndex(0);
        const hasRealData =
          firstRowNode && firstRowNode.data && Object.keys(firstRowNode.data).length > 0;

        if (hasRealData) {
          event.api.autoSizeAllColumns();
        }
      }
    });
  },
};
