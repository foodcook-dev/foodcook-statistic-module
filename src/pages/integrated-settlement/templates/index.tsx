import { AgGridReact } from 'ag-grid-react';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { gridOptions } from '../config/grid-config';
import { useIntegratedSettlement } from '../hooks/useIntegratedSettlement';
import ColumnStateResetButton from '@/components/modules/column-reset-button';
import { STORAGE_KEYS } from '@/libs/column-state';

// import { ThemeToggle } from '@/components/modules/theme-toggle';

export default function IntegratedSettlement() {
  const { gridRef, dateRange, setDateRange, onGridReady, error } = useIntegratedSettlement();

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
          {/* <ThemeToggle /> */}
        </div>
        <ColumnStateResetButton
          storageKey={STORAGE_KEYS.INTEGRATED_SETTLEMENT}
          gridApi={gridRef.current?.api}
        />
      </div>
      <div className="w-full h-[600px] relative">
        <AgGridReact ref={gridRef} gridOptions={gridOptions} onGridReady={onGridReady} />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center bg-foreground shadow-lg rounded-lg p-6 border border-foreground">
              <p className="text-contrast text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
