import { GridApi, ColumnState } from 'ag-grid-community';

export const loadColumnState = (storageKey: string): ColumnState[] | null => {
  try {
    const savedState = localStorage.getItem(storageKey);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Failed to load column state from localStorage:', error);
    return null;
  }
};

export const saveColumnState = (storageKey: string, columnState: ColumnState[]): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(columnState));
  } catch (error) {
    console.error('Failed to save column state to localStorage:', error);
  }
};

export const getCurrentColumnState = (gridApi: GridApi): ColumnState[] => {
  return gridApi.getColumnState();
};

export const restoreColumnState = (gridApi: GridApi, columnState: ColumnState[]): void => {
  gridApi.applyColumnState({
    state: columnState,
    applyOrder: true,
  });
};

export const createColumnStateChangeHandler = (storageKey: string, gridApi: GridApi) => {
  return () => {
    const columnState = getCurrentColumnState(gridApi);
    saveColumnState(storageKey, columnState);
  };
};

export const initializeColumnStateManagement = (storageKey: string, gridApi: GridApi): void => {
  const savedState = loadColumnState(storageKey);
  if (savedState) {
    restoreColumnState(gridApi, savedState);
  }

  const saveHandler = createColumnStateChangeHandler(storageKey, gridApi);

  gridApi.addEventListener('columnMoved', saveHandler);
  gridApi.addEventListener('columnPinned', saveHandler);
  // gridApi.addEventListener('columnResized', saveHandler);
  gridApi.addEventListener('columnVisible', saveHandler);
  gridApi.addEventListener('sortChanged', saveHandler);
};

export const cleanupColumnStateManagement = (storageKey: string, gridApi: GridApi): void => {
  const saveHandler = createColumnStateChangeHandler(storageKey, gridApi);

  gridApi.removeEventListener('columnMoved', saveHandler);
  gridApi.removeEventListener('columnPinned', saveHandler);
  // gridApi.removeEventListener('columnResized', saveHandler);
  gridApi.removeEventListener('columnVisible', saveHandler);
  gridApi.removeEventListener('sortChanged', saveHandler);
};

export const resetColumnState = (storageKey: string): void => {
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to reset column state:', error);
  }
};

// 미사용 추후 사용가능성?
export const resetAllColumnStates = (storageKeys: string[]): void => {
  storageKeys.forEach((key) => resetColumnState(key));
};

export const STORAGE_KEYS = {
  INTEGRATED_SETTLEMENT: 'grid-column-state-integrated-settlement',
  DIRECT_SETTLEMENT: 'grid-column-state-direct-settlement',
  CONSIGNMENT_SETTLEMENT: 'grid-column-state-consignment-settlement',
} as const;
