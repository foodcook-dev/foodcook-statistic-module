import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';
import { TYPE, PAYMENT } from '@/constants/badge';
import { TYPE_LIST, PAYMENT_LIST } from '@/constants/filter';
import SelectFilter from '@/components/modules/select-filter';

const typeRenderer = createBadgeRenderer(TYPE);
const paymentRenderer = createBadgeRenderer(PAYMENT);

const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'ID', field: 'company_id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  {
    headerName: '매입사명',
    field: 'b_nm',
    pinned: 'left',
    sortable: true,
    filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ['contains'],
      maxNumConditions: 0,
    },
    cellStyle: { cursor: 'pointer' },
  },
  {
    field: 'type',
    headerName: '매입 유형',
    filter: SelectFilter,
    filterParams: { type: 'checkbox', structure: TYPE_LIST },
    cellRenderer: typeRenderer,
    cellStyle: { textAlign: 'center' },
  },
  {
    field: 'payment_date',
    headerName: '결제일',
    filter: SelectFilter,
    filterParams: { type: 'checkbox', structure: PAYMENT_LIST },
    cellRenderer: paymentRenderer,
    cellStyle: { textAlign: 'center' },
  },
  { headerName: '사업자번호', field: 'b_no' },
  createNumericColumn('previous_balance', '전기이월액', { sortable: true }),
  createNumericColumn('sales_amount', '매출액', {
    sortable: true,
    headerClass: 'ag-header-2 centered',
  }),
  {
    headerName: '매입정보',
    headerClass: 'ag-header-3 centered',
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
        sortable: true,
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
    ],
  },
  {
    headerName: '정산정보',
    headerClass: 'ag-header-4 centered',
    children: [
      createNumericColumn('commission_rate', '정산 수수료(%)', {
        columnGroupShow: 'open',
        cellStyle: { textAlign: 'right' },
      }),
      createNumericColumn('app_fee', '앱 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('other_fee', '기타 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('expected_settlement', '정산 예정액', {
        sortable: true,
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
    ],
  },
  {
    headerName: '결제정보',
    headerClass: 'ag-header-5 centered',
    children: [
      createNumericColumn('discount_amount', '결제 차감액[할인]'),
      createNumericColumn('payment_amount', '결제 완료액', {
        sortable: true,
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
      createNumericColumn('invoice_total', '계산서발행 총액', { sortable: true }),
    ],
  },
  createNumericColumn('balance', '잔액', {
    minWidth: 180,
    pinned: 'right',
    sortable: true,
    headerStyle: { backgroundColor: 'rgb(255 252 151)', color: 'red' },
    cellStyle: { backgroundColor: 'rgb(253 255 217)', color: 'red', fontWeight: 'bold' },
  }),
  {
    headerName: '최종 매입일',
    field: 'last_purchase_date',
    sortable: true,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: '최종 지급일',
    field: 'last_payment_date',
    sortable: true,
    cellStyle: { textAlign: 'right' },
  },
  createNumericColumn('total_product_inventory_value', '상품재고액(전일자 기준)', {
    sortable: true,
  }),
  { headerName: '전자 세금계산서', field: 'tax_invoice_email' },
  { headerName: '비고', field: 'memo' },
];

export const gridOptions: GridOptions = {
  defaultColDef: { headerClass: 'centered', sortable: false, floatingFilter: false },
  columnDefs: columnDefs,

  rowModelType: 'infinite',
  cacheBlockSize: 100,
  cacheOverflowSize: 2,
  maxConcurrentDatasourceRequests: 1,
  infiniteInitialRowCount: 1,
  maxBlocksInCache: 10,

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
