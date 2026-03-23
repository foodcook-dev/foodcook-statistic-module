import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { createBadgeRenderer, createTypeRenderer, createNumericColumn } from '@/libs/table-format';
import { TYPE } from '@/constants/badge';
import { TYPE_LIST, PAYMENT_LIST } from '@/constants/filter';
import SelectFilter from '@/components/modules/select-filter';

const typeRenderer = createBadgeRenderer(TYPE);
const paymentRenderer = createTypeRenderer();

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'ID',
    field: 'company_id',
    pinned: 'left',
    cellClass: 'ag-cell-center',
  },
  {
    headerName: '매입사명',
    field: 'b_nm',
    pinned: 'left',
    sortable: true,
    filter: 'agTextColumnFilter',
    filterParams: { filterOptions: ['contains'], maxNumConditions: 0 },
    cellClass: 'ag-cell-pointer',
  },
  {
    field: 'type',
    headerName: '매입 유형',
    filter: SelectFilter,
    filterParams: { type: 'checkbox', structure: TYPE_LIST },
    cellRenderer: typeRenderer,
    cellClass: 'ag-cell-center',
  },
  {
    field: 'payment_period',
    headerName: '결제주기',
    filter: SelectFilter,
    filterParams: { type: 'checkbox', structure: PAYMENT_LIST },
    cellRenderer: paymentRenderer,
    cellClass: 'ag-cell-center',
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
      createNumericColumn('tax_purchase', '매입 과세액', { columnGroupShow: 'open' }),
      createNumericColumn('tax_free_purchase', '매입 면세액', { columnGroupShow: 'open' }),
      createNumericColumn('purchase_amount', '매입액', {
        sortable: true,
        cellClass: 'ag-cell-accent',
      }),
    ],
  },
  {
    headerName: '정산정보',
    headerClass: 'ag-header-4 centered',
    children: [
      createNumericColumn('commission_rate', '정산 수수료(%)', {
        columnGroupShow: 'open',
        cellClass: 'ag-cell-right',
      }),
      createNumericColumn('app_fee', '앱 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('other_fee', '기타 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('expected_settlement', '정산 예정액', {
        sortable: true,
        cellClass: 'ag-cell-accent',
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
        cellClass: 'ag-cell-accent',
      }),
      createNumericColumn('invoice_total', '계산서발행 총액', { sortable: true }),
    ],
  },
  createNumericColumn('balance', '잔액', {
    minWidth: 180,
    pinned: 'right',
    sortable: true,
    headerClass: 'ag-header-accent centered',
    cellClass: 'ag-cell-highlight',
  }),
  {
    headerName: '최종 매입일',
    field: 'last_purchase_date',
    sortable: true,
    cellClass: 'ag-cell-right',
  },
  {
    headerName: '최종 지급일',
    field: 'last_payment_date',
    sortable: true,
    cellClass: 'ag-cell-right',
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
