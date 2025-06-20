import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { Search } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';
import { TEMP_ROW, TEMP_TYPE_BADGE, TEMP_PAYMENT_BADGE } from '../structure';

import './index.css';

const typeRenderer = createBadgeRenderer(TEMP_TYPE_BADGE);
const paymentRenderer = createBadgeRenderer(TEMP_PAYMENT_BADGE);

const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'ID', field: 'id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  { headerName: '매입사명', field: 'vendorName', pinned: 'left', filter: 'agTextColumnFilter' },
  {
    field: 'type',
    headerName: '매입 유형',
    cellRenderer: typeRenderer,
    cellStyle: { textAlign: 'center' },
  },
  {
    field: 'paymentTerm',
    headerName: '결제일',
    cellRenderer: paymentRenderer,
    cellStyle: { textAlign: 'center' },
  },
  { headerName: '사업자번호', field: 'businessNumber', filter: 'agTextColumnFilter' },
  createNumericColumn('previousCarryOver', '전기이월액'),
  createNumericColumn('salesAmount', '매출액', { headerStyle: { backgroundColor: '#ff7b54' } }),
  {
    headerName: '매입정보',
    headerStyle: { backgroundColor: 'rgb(255 133 98)' },
    children: [
      createNumericColumn('taxablePurchase', '매입 과세액', {
        columnGroupShow: 'open',
        cellStyle: { backgroundColor: 'rgb(239 239 239)' },
      }),
      createNumericColumn('taxFreePurchase', '매입 면세액', {
        columnGroupShow: 'open',
        cellStyle: { backgroundColor: 'rgb(239 239 239)' },
      }),
      createNumericColumn('totalPurchaseAmount', '매입액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
    ],
  },
  {
    headerName: '정산정보',
    headerStyle: { backgroundColor: 'rgb(255 147 117)' },
    children: [
      createNumericColumn('settlementFeePercent', '정산 수수료(%)', {
        columnGroupShow: 'open',
        cellStyle: { textAlign: 'right' },
      }),
      createNumericColumn('appFee', '앱 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('otherFee', '기타 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('expectedSettlement', '정산 예정액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
    ],
  },
  {
    headerName: '지급정보',
    headerStyle: { backgroundColor: 'rgb(255 131 100)' },
    children: [
      createNumericColumn('discountAmount', '지급 차감액[할인]'),
      createNumericColumn('paymentAmount', '지급 완료액', {
        cellStyle: { backgroundColor: 'rgb(255 247 220)' },
      }),
      createNumericColumn('invoiceTotal', '계산서발행 총액'),
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
    field: 'lastPurchaseDate',
    filter: 'agDateColumnFilter',
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: '최종 결제일',
    field: 'lastPaymentDate',
    filter: 'agDateColumnFilter',
    cellStyle: { textAlign: 'right' },
  },
  createNumericColumn('productStockAmount', '상품재고액'),
  { headerName: '전자 세금계산서', field: 'taxInvoiceEmail', filter: 'agTextColumnFilter' },
  { headerName: '비고', field: 'note' },
];

const gridOptions: GridOptions = {
  defaultColGroupDef: { headerClass: 'centered' },
  defaultColDef: { headerClass: 'centered' },
  columnDefs: columnDefs,
  autoSizeStrategy: {
    type: 'fitCellContents',
  },
  onGridReady: (event) => {
    event.api.autoSizeAllColumns();
  },
  onColumnGroupOpened: (event) => {
    event.api.autoSizeAllColumns();
  },
};

export default function IntegratedSettlement() {
  return (
    <div className="w-screen">
      <div className="p-8 bg-gray-100 border-b border-gray-300">
        <p>Integrated Settlement Page</p>
      </div>
      <div className="w-full flex flex-col p-8 gap-6">
        <div className="w-full flex justify-between gap-4">
          <div className="flex gap-2">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search" className="pl-8 border border-gray-300" />
            </div>
            <Button className="border border-gray-300 text-sm">검색</Button>
          </div>
        </div>
        <div className="w-full h-[700px]">
          <AgGridReact rowData={TEMP_ROW} gridOptions={gridOptions} />
        </div>
      </div>
    </div>
  );
}
