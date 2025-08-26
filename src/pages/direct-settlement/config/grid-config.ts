import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import {
  createBadgeRenderer,
  createTypeRenderer,
  createNumericColumn,
  getNegativeValueStyle,
} from '@/libs/table-format';
import SelectFilter from '@/components/modules/select-filter';
import { STATUS } from '@/constants/badge';
import { STATUS_LIST, PAYMENT_LIST } from '@/constants/filter';
import { Button } from '@/components/atoms/button';
import Payment from '@/components/modules/custom-dialog/payment-dialog';
import Log from '@/components/modules/custom-dialog/log-dialog';

const paymentRenderer = createTypeRenderer();

export const companyColumnDefs: ColDef[] = [
  { headerName: 'ID', field: 'buy_company_id', flex: 0.3, cellStyle: { textAlign: 'center' } },
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
    field: 'payment_period',
    flex: 0.5,
    headerName: '결제일',
    sortable: false,
    filter: SelectFilter,
    filterParams: { type: 'checkbox', structure: PAYMENT_LIST },
    floatingFilter: false,
    cellRenderer: paymentRenderer,
    cellStyle: { textAlign: 'center' },
  },
];

const statusRenderer = createBadgeRenderer(STATUS);

const createActionButtonRenderer = (
  onEdit: (data: any) => void,
  onDelete: (data: any) => void,
  selectedBuyerId: string,
) => {
  return (params: any) => {
    const isEditableRow = params.data?.type === '결제';
    if (!isEditableRow) return null;

    const handleDelete = () => onDelete(params.data);

    return React.createElement(
      'div',
      {
        className: 'flex gap-2 items-center justify-center h-full',
      },
      [
        React.createElement(
          Payment,
          {
            key: 'edit',
            title: '결제 수정',
            buttonClassName: 'w-[32px] h-[30px] bg-blue-500 text-white hover:bg-blue-300',
            onSubmit: onEdit,
            initialData: {
              id: params.data.detail_id,
              processDate: params.data?.process_date
                ? new Date(params.data.process_date)
                : new Date(),
              amount: params.data?.payment_amount || null,
              notes: params.data?.memo ? params.data.memo.split('|').pop()?.trim() || '' : '',
            },
          },
          React.createElement(Edit2, { size: 16 }),
        ),
        React.createElement(
          Button,
          {
            key: 'delete',
            className: 'w-[32px] h-[30px] bg-red-500 text-white hover:bg-red-300',
            onClick: handleDelete,
          },
          React.createElement(Trash2, { size: 16 }),
        ),
        React.createElement(Log, {
          key: 'log',
          endpoint: `/log/buy_company_logs/`,
          companyId: selectedBuyerId,
          detailId: params.data.detail_id,
        }),
      ],
    );
  };
};

export const createColumnDefs = (
  onEdit: (data: any) => void,
  onDelete: (data: any) => void,
  selectedBuyerId: string,
): (ColDef | ColGroupDef)[] => [
  { headerName: 'ID', field: 'detail_id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  {
    headerName: '전표상태',
    field: 'type',
    pinned: 'left',
    filter: SelectFilter,
    filterParams: { type: 'checkbox', structure: STATUS_LIST },
    cellStyle: { textAlign: 'center' },
    cellRenderer: statusRenderer,
  },
  { headerName: '처리일자', field: 'process_date', pinned: 'left' },
  {
    headerName: '매입정보',
    headerClass: 'ag-header-2 centered',
    children: [
      createNumericColumn('purchase_tax_amount', '매입 과세액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('purchase_tax_free_amount', '매입 면세액', {
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
    headerName: '결제정보',
    headerClass: 'ag-header-3 centered',
    children: [
      createNumericColumn('discount_amount', '결제 차감액[할인]'),
      createNumericColumn('payment_amount', '결제 완료액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
      createNumericColumn('invoice_total', '계산서발행 총액'),
    ],
  },
  createNumericColumn('balance', '잔액', {
    headerClass: 'ag-header-accent ag-right-aligned-header',
    cellStyle: (params) => {
      const baseStyle = { backgroundColor: 'rgb(253 255 217)' };
      return params.value < 0 ? { ...baseStyle, color: 'red' } : baseStyle;
    },
  }),
  { headerName: '비고', field: 'memo', flex: 1, minWidth: 500 },
  {
    headerName: '관리',
    field: 'event',
    minWidth: 100,
    cellRenderer: createActionButtonRenderer(onEdit, onDelete, selectedBuyerId),
    sortable: false,
    filter: false,
    pinned: 'right',
    cellStyle: { textAlign: 'center', padding: '4px' },
  },
];

export const columnDefs: (ColDef | ColGroupDef)[] = createColumnDefs(
  () => console.log('update'),
  () => console.log('delete'),
  '',
);

export const gridOptions: GridOptions = {
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
