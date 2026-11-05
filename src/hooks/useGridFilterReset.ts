import { useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FilterChangedEvent } from 'ag-grid-community';

// 그리드 필터 적용 여부를 추적하고 한 번에 해제하는 훅.
export function useGridFilterReset(gridRef: React.RefObject<AgGridReact | null>) {
  const [isFiltered, setIsFiltered] = useState(false);

  const onFilterChanged = useCallback((event: FilterChangedEvent) => {
    setIsFiltered(event.api.isAnyFilterPresent());
  }, []);

  const resetFilters = useCallback(() => {
    // 필터 모델이 바뀌면 infinite 그리드는 datasource를 다시 호출한다.
    gridRef.current?.api?.setFilterModel(null);
    setIsFiltered(false);
  }, [gridRef]);

  return { isFiltered, onFilterChanged, resetFilters };
}
