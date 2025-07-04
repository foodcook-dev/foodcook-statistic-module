import { AgGridReact } from 'ag-grid-react';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { gridOptions } from '../config/grid-config';
import { useIntegratedSettlement } from '../hooks/useIntegratedSettlement';

export default function IntegratedSettlement() {
  const { gridRef, dateRange, setDateRange, onGridReady } = useIntegratedSettlement();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">조회기간 :</span>
        <DateRangePicker
          date={dateRange}
          onDateSelect={({ from, to }) => setDateRange({ from, to })}
          contentAlign="start"
        />
      </div>
      <div className="w-full h-[600px]">
        <AgGridReact ref={gridRef} gridOptions={gridOptions} onGridReady={onGridReady} />
      </div>
    </div>
  );
}
