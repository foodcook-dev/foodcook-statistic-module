import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDirectSettlement } from '@/hooks/purchaser-dashboard/useDirectSettlement';
import DataSelector from '@/components/modules/data-selector';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import InfoTable from '@/components/modules/info-table';
import ColumnStateResetButton from '@/components/modules/column-reset-button';
import FilterResetButton from '@/components/modules/filter-reset-button';
import ExcelDownloadButton from '@/components/modules/excel-download-button';
import GridSummaryBar from '@/components/modules/grid-summary-bar';
import { useGridFilterReset } from '@/hooks/useGridFilterReset';
import Payment from '@/components/modules/custom-dialog/payment-dialog';
import { STORAGE_KEYS } from '@/libs/column-state';
import { companyColumnDefs, createColumnDefs, gridOptions } from './config/grid-config';
import { DIRECT_COMPANY_INFO } from './config/structure';
import { Tabs } from '@/components/modules/tab';

// import { ThemeToggle } from '@/components/modules/theme-toggle';

export default function DirectSettlement() {
  const {
    gridRef,
    dateRange,
    selectedDirectCompany,
    directCompanyInfo,
    setDateRange,
    setSelectedDirectCompany,
    handlePaymentSubmit,
    handleEdit,
    handleDelete,
    onGridReady,
    totalCount,
    totalPurchaseAmount,
    downloadExcel,
    isDownloading,
  } = useDirectSettlement();
  const { isFiltered, onFilterChanged, resetFilters } = useGridFilterReset(gridRef);

  const columnDefs = useMemo(
    () => createColumnDefs(handleEdit, handleDelete, selectedDirectCompany.id),
    [handleEdit, handleDelete, selectedDirectCompany.id],
  );

  const updatedGridOptions = useMemo(
    () => ({
      ...gridOptions,
      columnDefs: columnDefs,
    }),
    [columnDefs],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">매입사 :</span>
              <DataSelector
                className="w-[300px]"
                placeholder="매입사를 선택해주세요"
                label="직매입사"
                type="direct"
                valueKey="buy_company_id"
                displayKey="b_nm"
                columnDefs={companyColumnDefs}
                value={selectedDirectCompany.name}
                onSelect={(value, displayValue) =>
                  setSelectedDirectCompany({ id: value, name: displayValue })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">조회기간 :</span>
              <DateRangePicker
                date={dateRange}
                onDateSelect={({ from, to }) => setDateRange({ from, to })}
                contentAlign="end"
                maxDateType="today"
              />
            </div>
            {/* <ThemeToggle /> */}
          </div>
          <div className="text-xs text-gray-400">
            데이터는 매일 오전 1시에 전일 기준으로 업데이트됩니다.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExcelDownloadButton
            onDownload={downloadExcel}
            isDownloading={isDownloading}
            disabled={!selectedDirectCompany?.id}
          />
          <FilterResetButton onReset={resetFilters} disabled={!isFiltered} />
          <ColumnStateResetButton
            storageKey={STORAGE_KEYS.DIRECT_SETTLEMENT}
            gridApi={gridRef.current?.api}
          />
          <Payment onSubmit={handlePaymentSubmit} paymentDisabled={!selectedDirectCompany?.id} />
        </div>
      </div>
      <InfoTable data={DIRECT_COMPANY_INFO} info={directCompanyInfo} />
      {!selectedDirectCompany?.id ? (
        <div className="h-[500px] w-full">
          <div className="bg-foreground border-border flex h-full items-center justify-center rounded-lg border">
            <div className="text-center">
              <p className="text-contrast text-lg font-medium">매입사를 선택해주세요</p>
              <p className="mt-2 text-sm text-gray-400">조회할 매입사를 선택해주시기 바랍니다.</p>
            </div>
          </div>
        </div>
      ) : (
        // 그리드와 하단 요약 줄을 하나의 표처럼 붙인다. (그리드 444px + 요약 줄 56px = 안내 화면 500px)
        <div className="flex flex-col">
          <div className="h-[444px] w-full [&_.ag-root-wrapper]:rounded-b-none">
            <AgGridReact
              ref={gridRef}
              gridOptions={updatedGridOptions}
              onGridReady={onGridReady}
              onFilterChanged={onFilterChanged}
            />
          </div>
          <GridSummaryBar
            count={totalCount}
            countUnit="건"
            amount={totalPurchaseAmount}
            isFiltered={isFiltered}
          />
        </div>
      )}
    </div>
  );
}
