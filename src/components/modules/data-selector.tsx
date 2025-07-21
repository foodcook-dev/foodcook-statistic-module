import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef, type GridOptions } from 'ag-grid-community';
import { SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import SelectFilter from '@/components/modules/select-filter';

type DataSelectorProps = {
  placeholder?: string;
  label: string;
  endpoint: string; // API 엔드포인트
  value?: string;
  onSelect: (value: any, displayValue: string) => void;
  valueKey?: string; // 실제 값으로 사용할 키 (기본값: 'id')
  displayKey?: string; // 표시할 값으로 사용할 키 (기본값: 'name')
  triggerText?: string; // 선택 버튼 텍스트 (기본값: '선택')
  className?: string;
  disabled?: boolean;
  columnDefs: ColDef[]; // 그리드 컬럼 정의
};

export default function DataSelector({
  placeholder = '',
  label,
  value = '',
  onSelect,
  valueKey = 'id',
  displayKey = 'name',
  className = '',
  disabled = false,
  endpoint,
  columnDefs,
}: DataSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const bodyResponse = useQuery({
    queryKey: ['dataSelector', endpoint],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint,
      }),
    enabled: isDialogOpen,
  });

  const defaultGridOptions: GridOptions = {
    defaultColDef: { headerClass: 'centered' },
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
        className="flex-1"
        readOnly
        disabled={disabled}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="whitespace-nowrap bg-primary text-white border-primary hover:bg-primary-hover hover:border-primary-hover"
            disabled={disabled}
          >
            <SearchIcon className="inline-block" />
            선택
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[650px] border-border bg-background text-contrast max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{label} 선택</DialogTitle>
          </DialogHeader>
          <div className="h-96 w-full">
            <AgGridReact
              gridOptions={defaultGridOptions}
              rowData={bodyResponse.data}
              onRowClicked={onRowClicked}
              rowSelection="single"
              components={{ customFilter: SelectFilter }}
              suppressDragLeaveHidesColumns
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
