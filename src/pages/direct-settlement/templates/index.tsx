import { AgGridReact } from 'ag-grid-react';
import { useDirectSettlement } from '../hooks/useDirectSettlement';
import { companyColumnDefs, gridOptions } from '../config/grid-config';
import DataSelector from '@/components/modules/data-selector';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import InfoTable from '@/components/modules/info-table';
import { BUYER_INFO } from '../structure';
import ColumnStateResetButton from '@/components/modules/column-state-reset-button';
import { STORAGE_KEYS } from '@/libs/column-state-storage';

export default function DirectSettlement() {
  const {
    gridRef,
    dateRange,
    selectedBuyer,
    buyerInfo,
    setDateRange,
    setSelectedBuyer,
    onGridReady,
  } = useDirectSettlement();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">매입사 :</span>
            <DataSelector
              className="w-[300px]"
              placeholder="매입사를 선택해주세요"
              label="직매입사"
              endpoint="/purchase/buy_companies/"
              valueKey="buy_company_id"
              displayKey="b_nm"
              columnDefs={companyColumnDefs}
              value={selectedBuyer?.name}
              onSelect={(value, displayValue) =>
                setSelectedBuyer({ id: value, name: displayValue })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">조회기간 :</span>
            <DateRangePicker
              date={dateRange}
              onDateSelect={({ from, to }) => setDateRange({ from, to })}
              contentAlign="end"
            />
          </div>
        </div>
        <ColumnStateResetButton
          storageKey={STORAGE_KEYS.DIRECT_SETTLEMENT}
          gridApi={gridRef.current?.api}
        />
      </div>
      <InfoTable data={BUYER_INFO} info={buyerInfo} />
      <div className="w-full h-[500px]">
        {!selectedBuyer?.id ? (
          <div className="flex items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 text-lg font-medium">매입사를 선택해주세요</p>
              <p className="text-gray-400 text-sm mt-2">조회할 매입사를 선택해주시기 바랍니다.</p>
            </div>
          </div>
        ) : (
          <AgGridReact ref={gridRef} gridOptions={gridOptions} onGridReady={onGridReady} />
        )}
      </div>
    </div>
  );
}
