import { AgGridReact } from 'ag-grid-react';
import { useConsignmentSettlement } from '../hooks/useConsignmentSettlement';
import { companyColumnDefs, gridOptions } from '../config/grid-config';
import DataSelector from '@/components/modules/data-selector';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import { groupIntoPairs } from '@/libs/utils';
import { PARTNER_INFO } from '../structure';

export default function ConsignmentSettlement() {
  const {
    gridRef,
    dateRange,
    selectedPartner,
    partnerInfo,
    setDateRange,
    setSelectedPartner,
    onGridReady,
  } = useConsignmentSettlement();

  return (
    <div className="w-full flex flex-col gap-6">
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
          />
        </div>
      </div>
      <div className="flex flex-col border-t border-gray-300 text-sm text-gray-900">
        {groupIntoPairs(PARTNER_INFO, 2).map((rowPair, index) => (
          <div key={index} className="flex items-center border-b border-gray-300 bg-white p-3">
            {rowPair.map((item, itemIndex) => (
              <div key={itemIndex} className="flex w-1/2">
                <div className="font-semibold w-1/4">{item.label}</div>
                <div className="w-3/4">{partnerInfo?.[item.value] || '-'}</div>
              </div>
            ))}
            {rowPair.length === 1 && <div className="flex w-1/2"></div>}
          </div>
        ))}
      </div>
      <div className="w-full h-[500px]">
        {!selectedPartner?.id ? (
          <div className="flex items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 text-lg font-medium">매입사를 선택해주세요</p>
              <p className="text-gray-400 text-sm mt-2">
                조회할 매입사를 먼저 선택해주시기 바랍니다.
              </p>
            </div>
          </div>
        ) : (
          <AgGridReact ref={gridRef} gridOptions={gridOptions} onGridReady={onGridReady} />
        )}
      </div>
    </div>
  );
}
