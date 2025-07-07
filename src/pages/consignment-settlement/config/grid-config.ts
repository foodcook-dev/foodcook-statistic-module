import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import {
  createBadgeRenderer,
  createNumericColumn,
  getNegativeValueStyle,
} from '@/libs/table-format';
import SelectFilter from '@/components/modules/select-filter';
import { STATUS, PAYMENT } from '@/constants/badge';

const paymentRenderer = createBadgeRenderer(PAYMENT);

export const companyColumnDefs: ColDef[] = [
  { headerName: 'ID', field: 'partner_company_id', flex: 0.3, cellStyle: { textAlign: 'center' } },
  {
    headerName: '매입사명',
    field: 'b_nm',
    headerClass: '',
    flex: 1,
    filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ['contains'],
      maxNumConditions: 0,
    },
  },
  {
    field: 'type',
    flex: 0.5,
    headerName: '결제일',
    sortable: false,
    filter: SelectFilter,
    floatingFilter: false,
    cellRenderer: paymentRenderer,
    cellStyle: { textAlign: 'center' },
  },
];

const statusRenderer = createBadgeRenderer(STATUS);

const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'ID', field: 'detail_id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  {
    headerName: '전표상태',
    field: 'type',
    pinned: 'left',
    filter: SelectFilter,
    filterParams: { structure: STATUS },
    cellStyle: { textAlign: 'center' },
    cellRenderer: statusRenderer,
  },
  { headerName: '처리일자', pinned: 'left', field: 'process_date' },
  {
    headerName: '매출정보',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerStyle: { backgroundColor: '#ff7b54' },
    children: [
      createNumericColumn('sales_amount', '매출액', {
        cellStyle: getNegativeValueStyle,
      }),
    ],
  },
  {
    headerName: '매입정보',
    headerStyle: { backgroundColor: 'rgb(255 133 98)' },
    children: [
      createNumericColumn('tax_purchase', '매입 과세액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('tax_free_purchase', '매입 면세액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('purchase_amount', '매입액', {
        cellStyle: (params) => {
          const baseStyle = { backgroundColor: 'rgb(255 247 220)' };
          return params.value < 0 ? { ...baseStyle, color: 'red' } : baseStyle;
        },
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
  { headerName: '비고', field: 'note', flex: 1 },
];

export const gridOptions: GridOptions = {
  defaultColGroupDef: { headerClass: 'centered' },
  defaultColDef: { headerClass: 'centered', sortable: false, floatingFilter: false },
  columnDefs: columnDefs,

  rowModelType: 'infinite',
  cacheBlockSize: 50,
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
