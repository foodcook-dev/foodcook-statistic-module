import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type GridOptions } from 'ag-grid-community';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import CustomFilter from '@/components/modules/custom-filter';
import { createBadgeRenderer } from '@/libs/table-format';
import { TEMP_PAYMENT_BADGE } from '@/pages/integrated-settlement/structure';

type DataSelectorProps = {
  data: any[];
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
  data = [],
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

  const paymentRenderer = createBadgeRenderer(TEMP_PAYMENT_BADGE);

  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', flex: 0.3, cellStyle: { textAlign: 'center' } },
    { headerName: '매입사명', field: 'name', flex: 1, filter: 'agTextColumnFilter' },
    {
      field: 'type',
      flex: 0.5,
      headerName: '결제일',
      filter: CustomFilter,
      floatingFilter: false,
      filterParams: {
        valueGetter: (obj: any) => {
          return console.log(obj.data.statusEnum);
        },
        hideCompleteByDefault: true,
      },
      cellRenderer: paymentRenderer,
      cellStyle: { textAlign: 'center' },
    },
  ];

  const gridOptions: GridOptions = {
    defaultColDef: { headerClass: 'centered' },
    columnDefs: columnDefs,
  };

  const onRowClicked = (event: any) => {
    const { data: item } = event;

    const selectedValue = item[valueKey] || item.id || item.name || item;

    const displayValue = item[displayKey] || item.name || item.title || item.id || String(item);

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
        <DialogContent className="w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{label} 선택</DialogTitle>
          </DialogHeader>
          <div className="h-96 w-full">
            <AgGridReact
              gridOptions={gridOptions}
              rowData={data}
              onRowClicked={onRowClicked}
              rowSelection="single"
              defaultColDef={{ flex: 1 }}
              components={{ customFilter: CustomFilter }}
            />
            {data.length === 0 && (
              <div className="text-center py-8 text-gray-500">데이터가 없습니다.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
