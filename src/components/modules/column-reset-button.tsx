import React from 'react';
import { GridApi } from 'ag-grid-community';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { resetColumnState } from '@/libs/column-state';

interface ColumnStateResetButtonProps {
  storageKey: string;
  gridApi?: GridApi;
  onReset?: () => void;
}

export const ColumnStateResetButton: React.FC<ColumnStateResetButtonProps> = ({
  storageKey,
  gridApi,
  onReset,
}) => {
  const handleReset = () => {
    resetColumnState(storageKey);

    if (gridApi) {
      gridApi.resetColumnState();
      gridApi.autoSizeAllColumns();
    } else {
      window.location.reload();
    }

    onReset?.();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleReset}
          variant="outline"
          aria-label="컬럼 설정 초기화"
          className="text-contrast/70 hover:text-contrast w-9 px-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px]">
        <p className="font-semibold">컬럼 설정 초기화</p>
        <p className="mt-1 leading-relaxed opacity-80">
          삭제한 컬럼을 다시 보이게 하고,
          <br />
          컬럼 순서·너비·고정·정렬을 기본값으로 되돌립니다.
          <br />
          적용중인 필터는 유지됩니다.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ColumnStateResetButton;
