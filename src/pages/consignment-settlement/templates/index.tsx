import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useConsignmentSettlement } from '../hooks/useConsignmentSettlement';
import DataSelector from '@/components/modules/data-selector';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import InfoTable from '@/components/modules/info-table';
import Payment from '@/components/modules/custom-dialog/payment-dialog';
import { PARTNER_INFO } from '../structure';
import ColumnStateResetButton from '@/components/modules/column-reset-button';
import { STORAGE_KEYS } from '@/libs/column-state';
import { companyColumnDefs, createColumnDefs, gridOptions } from '../config/grid-config';
import { Tabs } from '@/components/modules/tab';

// import { ThemeToggle } from '@/components/modules/theme-toggle';

export default function ConsignmentSettlement() {
  const {
    gridRef,
    dateRange,
    selectedPartner,
    partnerInfo,
    setDateRange,
    setSelectedPartner,
    handleEdit,
    handleDelete,
    onGridReady,
    handlePaymentSubmit,
  } = useConsignmentSettlement();

  const columnDefs = useMemo(
    () => createColumnDefs(handleEdit, handleDelete, selectedPartner.id),
    [handleEdit, handleDelete, selectedPartner.id],
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
                label="위탁매입사"
                endpoint="/partner/partner_companies/"
                valueKey="partner_company_id"
                displayKey="b_nm"
                columnDefs={companyColumnDefs}
                value={selectedPartner?.name}
                onSelect={(value, displayValue) =>
                  setSelectedPartner({ id: value, name: displayValue })
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
          <ColumnStateResetButton
            storageKey={STORAGE_KEYS.CONSIGNMENT_SETTLEMENT}
            gridApi={gridRef.current?.api}
          />
          <Payment onSubmit={handlePaymentSubmit} disabled={!selectedPartner?.id} />
        </div>
      </div>
      <InfoTable data={PARTNER_INFO} info={partnerInfo} />
      <div className="h-[500px] w-full">
        {!selectedPartner?.id ? (
          <div className="bg-foreground border-border flex h-full items-center justify-center rounded-lg border">
            <div className="text-center">
              <p className="text-contrast text-lg font-medium">매입사를 선택해주세요</p>
              <p className="mt-2 text-sm text-gray-400">조회할 매입사를 선택해주시기 바랍니다.</p>
            </div>
          </div>
        ) : (
          <AgGridReact ref={gridRef} gridOptions={updatedGridOptions} onGridReady={onGridReady} />
        )}
      </div>
    </div>
  );
}
