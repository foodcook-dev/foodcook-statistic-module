import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';
import SelectFilter from '@/components/modules/select-filter';
import { STATUS, PAYMENT } from '@/constants/badge';
import { Button } from '@/components/atoms/button';
import Payment from '@/components/modules/payment-dialog';

const paymentRenderer = createBadgeRenderer(PAYMENT);

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

const createActionButtonRenderer = (onEdit: (data: any) => void, onDelete: (data: any) => void) => {
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
      ],
    );
  };
};

export const createColumnDefs = (
  onEdit: (data: any) => void,
  onDelete: (data: any) => void,
): (ColDef | ColGroupDef)[] => [
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
  { headerName: '처리일자', field: 'process_date', pinned: 'left' },
  {
    headerName: '매입정보',
    headerClass: 'ag-header-2 centered',
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
    cellRenderer: createActionButtonRenderer(onEdit, onDelete),
    sortable: false,
    filter: false,
    pinned: 'right',
    cellStyle: { textAlign: 'center', padding: '4px' },
  },
];

export const columnDefs: (ColDef | ColGroupDef)[] = createColumnDefs(
  () => console.log('기본 수정'),
  () => console.log('기본 삭제'),
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
