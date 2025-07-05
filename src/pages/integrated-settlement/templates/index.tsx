import { AgGridReact } from 'ag-grid-react';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { gridOptions } from '../config/grid-config';
import { useIntegratedSettlement } from '../hooks/useIntegratedSettlement';
import ColumnStateResetButton from '@/components/modules/column-state-reset-button';
import { STORAGE_KEYS } from '@/libs/column-state-storage';

export default function IntegratedSettlement() {
  const { gridRef, dateRange, setDateRange, onGridReady } = useIntegratedSettlement();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">조회기간 :</span>
          <DateRangePicker
            date={dateRange}
            onDateSelect={({ from, to }) => setDateRange({ from, to })}
            contentAlign="start"
          />
        </div>
        <ColumnStateResetButton
          storageKey={STORAGE_KEYS.INTEGRATED_SETTLEMENT}
          gridApi={gridRef.current?.api}
        />
      </div>
      <div className="w-full h-[600px]">
        {/* {!selectedBuyer?.id ? (
          <div className="flex items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 text-lg font-medium">매입사를 선택해주세요</p>
              <p className="text-gray-400 text-sm mt-2">조회할 매입사를 선택해주시기 바랍니다.</p>
            </div>
          </div>
        ) : ( */}
        <AgGridReact ref={gridRef} gridOptions={gridOptions} onGridReady={onGridReady} />
        {/* )} */}
      </div>
    </div>
  );
}
