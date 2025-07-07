import React from 'react';
import { GridApi } from 'ag-grid-community';
import { Button } from '@/components/atoms/button';
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
    <Button onClick={handleReset} variant="outline" className={`px-3 py-1 text-xs`}>
      컬럼 설정 초기화
    </Button>
  );
};

export default ColumnStateResetButton;
