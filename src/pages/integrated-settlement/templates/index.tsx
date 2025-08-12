import { AgGridReact } from 'ag-grid-react';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { gridOptions } from '../config/grid-config';
import { useIntegratedSettlement } from '../hooks/useIntegratedSettlement';
import ColumnStateResetButton from '@/components/modules/column-reset-button';
import { STORAGE_KEYS } from '@/libs/column-state';
import { Tabs } from '@/components/modules/tab';

// import { ThemeToggle } from '@/components/modules/theme-toggle';

export default function IntegratedSettlement() {
  const { gridRef, dateRange, handleCellClick, setDateRange, onGridReady, error } =
    useIntegratedSettlement();

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">조회기간 :</span>
            <DateRangePicker
              date={dateRange}
              onDateSelect={({ from, to }) => setDateRange({ from, to })}
              contentAlign="start"
              maxDateType="today"
            />
            {/* <ThemeToggle /> */}
          </div>
          <ColumnStateResetButton
            storageKey={STORAGE_KEYS.INTEGRATED_SETTLEMENT}
            gridApi={gridRef.current?.api}
          />
        </div>
        <div className="text-xs text-gray-400">
          데이터는 매일 오전 1시에 전일 기준으로 업데이트됩니다.
        </div>
      </div>
      <div className="relative h-[600px] w-full">
        <AgGridReact
          ref={gridRef}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
          onCellClicked={handleCellClick}
        />
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="bg-foreground border-foreground rounded-lg border p-6 text-center shadow-lg">
              <p className="text-contrast text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
