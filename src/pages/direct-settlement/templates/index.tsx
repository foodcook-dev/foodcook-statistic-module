import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type ColGroupDef, GridOptions } from 'ag-grid-community';
import { TEMP_ROW, TEMP_INFO, TEMP_BADGE } from '../structure';
import DataSelector from '@/components/modules/data-selector';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { Button } from '@/components/atoms/button';
import { createBadgeRenderer, createNumericColumn } from '@/libs/table-format';

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
    headerName: '매입정보',
    headerStyle: { backgroundColor: 'rgb(255 133 98)' },
    children: [
      createNumericColumn('purchaseAmount', '매입액', {
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

export default function DirectSettlement() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });

  const [selectedValue, setSelectedValue] = useState<{ id: string; 매입사: string }>();

  const tempData = [
    { id: '0000', name: '오뚜기', type: '월 결제' },
    { id: '0001', name: '푸른덕산', type: '15일 결제' },
    { id: '0002', name: '씨제이프레시웨이', type: '선금 지급' },
    { id: '0003', name: '웹발주', type: '매입시 지급' },
    { id: '0004', name: '세천팜', type: '주 결제' },
    { id: '0005', name: '더조은푸드', type: '월 결제' },
    { id: '0006', name: '축성농장', type: '15일 결제' },
    { id: '0007', name: '디엠푸드빌', type: '선금 지급' },
    { id: '0008', name: '다미에프엔비', type: '매입시 지급' },
    { id: '0009', name: '원진', type: '주 결제' },
    { id: '0010', name: '해든나라', type: '월 결제' },
    { id: '0011', name: '합천식품', type: '15일 결제' },
    { id: '0012', name: '굿프렌즈', type: '선금 지급' },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <DataSelector
            className="w-[300px]"
            data={tempData}
            placeholder={'매입사를 선택해주세요'}
            label="직매입사"
            value={selectedValue?.매입사}
            onSelect={(value, displayValue) => {
              setSelectedValue({ id: value, 매입사: displayValue });
            }}
          />
        </div>
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
