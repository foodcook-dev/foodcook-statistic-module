import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type GridOptions } from 'ag-grid-community';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import CustomFilter from '@/components/modules/select-filter';
import { createBadgeRenderer } from '@/libs/table-format';
import createAxios from '@/libs/createAxiosInstance';
import { TEMP_PAYMENT_BADGE } from '@/pages/integrated-settlement/structure';

type DataSelectorProps = {
  placeholder?: string;
  label: string;
  value?: string;
  onSelect: (value: any, displayValue: string) => void;
  valueKey?: string; // 실제 값으로 사용할 키 (기본값: 'id')
  displayKey?: string; // 표시할 값으로 사용할 키 (기본값: 'name')
  triggerText?: string; // 선택 버튼 텍스트 (기본값: '선택')
  className?: string;
  disabled?: boolean;
};

export default function DataSelector({
  placeholder = '',
  label,
  value = '',
  onSelect,
  valueKey = 'id',
  displayKey = 'name',
  triggerText = '선택',
  className = '',
  disabled = false,
}: DataSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const bodyResponse = useQuery({
    queryKey: ['stock', 'header'],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/purchase/buy_companies/`,
      }),
  });

  const paymentRenderer = createBadgeRenderer(TEMP_PAYMENT_BADGE);

  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'buy_company_id', flex: 0.3, cellStyle: { textAlign: 'center' } },
    {
      headerName: '매입사명',
      field: 'b_nm',
      headerClass: '',
      flex: 1,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'type',
      flex: 0.5,
      headerName: '결제일',
      sortable: false,
      filter: CustomFilter,
      floatingFilter: false,
      cellRenderer: paymentRenderer,
      cellStyle: { textAlign: 'center' },
    },
  ];

  const gridOptions: GridOptions = {
    defaultColDef: { headerClass: 'centered', resizable: false },
    columnDefs: columnDefs,
  };

  const onRowClicked = (event: any) => {
    const { data: item } = event;

    const selectedValue = item[valueKey];
    const displayValue = item[displayKey];

    onSelect(selectedValue, displayValue);
    setIsDialogOpen(false);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        className="flex-1 border border-gray-300"
        readOnly
        disabled={disabled}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="whitespace-nowrap" disabled={disabled}>
            {triggerText}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[650px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{label} 선택</DialogTitle>
          </DialogHeader>
          <div className="h-96 w-full">
            <AgGridReact
              gridOptions={gridOptions}
              rowData={bodyResponse.data}
              onRowClicked={onRowClicked}
              rowSelection="single"
              components={{ customFilter: CustomFilter }}
            />
            {bodyResponse.data?.length === 0 && (
              <div className="text-center py-8 text-gray-500">데이터가 없습니다.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
