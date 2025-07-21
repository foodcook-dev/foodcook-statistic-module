import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDirectSettlement } from '../hooks/useDirectSettlement';
import DataSelector from '@/components/modules/data-selector';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import InfoTable from '@/components/modules/info-table';
import ColumnStateResetButton from '@/components/modules/column-reset-button';
import Payment from '@/components/modules/custom-dialog/payment-dialog';
import { STORAGE_KEYS } from '@/libs/column-state';
import { companyColumnDefs, createColumnDefs, gridOptions } from '../config/grid-config';
import { BUYER_INFO } from '../structure';
import { Tabs } from '@/components/modules/tab';

// import { ThemeToggle } from '@/components/modules/theme-toggle';

export default function DirectSettlement() {
  const {
    gridRef,
    dateRange,
    selectedBuyer,
    buyerInfo,
    setDateRange,
    setSelectedBuyer,
    handlePaymentSubmit,
    handleEdit,
    handleDelete,
    onGridReady,
  } = useDirectSettlement();

  const columnDefs = useMemo(
    () => createColumnDefs(handleEdit, handleDelete, selectedBuyer.id),
    [handleEdit, handleDelete, selectedBuyer.id],
  );

  const updatedGridOptions = useMemo(
    () => ({
      ...gridOptions,
      columnDefs: columnDefs,
    }),
    [columnDefs],
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <Tabs />
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
              value={selectedBuyer.name}
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
          {/* <ThemeToggle /> */}
        </div>
        <div className="flex items-center gap-2">
          <ColumnStateResetButton
            storageKey={STORAGE_KEYS.DIRECT_SETTLEMENT}
            gridApi={gridRef.current?.api}
          />
          <Payment onSubmit={handlePaymentSubmit} />
        </div>
      </div>
      <InfoTable data={BUYER_INFO} info={buyerInfo} />
      <div className="w-full h-[500px]">
        {!selectedBuyer?.id ? (
          <div className="flex items-center justify-center h-full bg-foreground border border-border rounded-lg">
            <div className="text-center">
              <p className="text-contrast text-lg font-medium">매입사를 선택해주세요</p>
              <p className="text-gray-400 text-sm mt-2">조회할 매입사를 선택해주시기 바랍니다.</p>
            </div>
          </div>
        ) : (
          <AgGridReact ref={gridRef} gridOptions={updatedGridOptions} onGridReady={onGridReady} />
        )}
      </div>
    </div>
  );
}
