import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { TEMP_ROW, TEMP_INFO, TEMP_BADGE } from '../structure';
import { ComboboxTemp } from '@/components/modules/combobox';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { Button } from '@/components/atoms/button';
import {
  createBadgeRenderer,
  createNumericColumn,
  getNegativeValueStyle,
} from '@/libs/table-format';

import './index.css';

const statusRenderer = createBadgeRenderer(TEMP_BADGE);

const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'ID', field: 'id', pinned: 'left', cellStyle: { textAlign: 'center' } },
  {
    headerName: '전표상태',
    field: 'type',
    pinned: 'left',
    cellStyle: { textAlign: 'center' },
    cellRenderer: statusRenderer,
  },
  { headerName: '처리일자', pinned: 'left', field: 'processDate' },
  {
    headerName: '매출정보',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerStyle: { backgroundColor: '#ff7b54' },
    children: [
      createNumericColumn('cardSales', '카드 매출액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('virtualAccountSales', '가상계좌 매출액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('pointSales', '포인트 매출액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('chargeSales', '충전금 매출액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('salesAmount', '매출액', {
        cellStyle: getNegativeValueStyle,
      }),
    ],
  },
  {
    headerName: '매입정보',
    headerStyle: { backgroundColor: 'rgb(255 133 98)' },
    children: [
      createNumericColumn('taxablePurchase', '매입 과세액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('taxFreePurchase', '매입 면세액', {
        columnGroupShow: 'open',
        cellStyle: getNegativeValueStyle,
      }),
      createNumericColumn('purchaseAmount', '매입액', {
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
      createNumericColumn('commissionRate', '정산 수수료(%)', {
        columnGroupShow: 'open',
        cellStyle: { textAlign: 'right' },
      }),
      createNumericColumn('appFee', '앱 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('otherFee', '기타 수수료', { columnGroupShow: 'open' }),
      createNumericColumn('expectedSettlement', '정산 예정액', {
        cellStyle: (params) => {
          const baseStyle = { backgroundColor: 'rgb(255 247 220)' };
          return params.value < 0 ? { ...baseStyle, color: 'red' } : baseStyle;
        },
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
    headerStyle: { backgroundColor: 'rgb(237 76 36)' },
    cellStyle: (params) => {
      const baseStyle = { backgroundColor: 'rgb(253 255 217)' };
      return params.value < 0 ? { ...baseStyle, color: 'red' } : baseStyle;
    },
  }),
  { headerName: '비고', field: 'note', flex: 1 },
];

const gridOptions: GridOptions = {
  defaultColGroupDef: { headerClass: 'centered' },
  defaultColDef: { headerClass: 'centered' },
  columnDefs: columnDefs,
  autoSizeStrategy: {
    type: 'fitCellContents',
  },
  onColumnGroupOpened: (event) => {
    event.api.autoSizeAllColumns();
  },
};

export default function ConsignmentSettlement() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <ComboboxTemp />
        <div className="flex items-center gap-2">
          <DateRangePicker
            date={dateRange}
            onDateSelect={({ from, to }) => setDateRange({ from, to })}
            contentAlign="end"
          />
          <Button className="text-sm">조회</Button>
        </div>
      </div>
      <div className="flex flex-col border-t border-gray-300 text-sm text-gray-900">
        {TEMP_INFO.map((row, index) => (
          <div key={index} className="flex items-center border-b border-gray-300 bg-white p-3">
            <div className="flex w-1/2">
              <div className="font-semibold w-1/4">{row.label1}</div>
              <div className="w-3/4">{row.value1}</div>
            </div>
            <div className="flex w-1/2">
              <div className="font-semibold w-1/4">{row.label2}</div>
              <div className="w-3/4">{row.value2}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-[435px]">
        <AgGridReact rowData={TEMP_ROW} gridOptions={gridOptions} />
      </div>
    </div>
  );
}
