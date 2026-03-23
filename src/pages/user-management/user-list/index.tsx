import { useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, IDatasource, IGetRowsParams, RowClickedEvent } from 'ag-grid-community';
import { getUserList } from '@/libs/user-management-api';
import { SearchBar } from '@/components/modules/SearchBar';
import { Filter } from '@/components/modules/user-management/Filter';
import Loading from '@/components/modules/grid/Loading';
import Empty from '@/components/modules/grid/Empty';
import { columnDefs } from './config/grid-config';
import { UserRow } from './config/row-structure';
import { USER_FILTERS } from './config/filter-field';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 50;

interface SearchParams {
  keyword?: string;
  platform?: string;
  business_verification_status?: string;
}

export default function UserManagementList() {
  const gridRef = useRef<AgGridReact<UserRow>>(null);
  const searchParamsRef = useRef<SearchParams>({});
  const navigate = useNavigate();

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<UserRow>) => {
      const userId = event.data?.id;
      if (userId) {
        navigate(`/user-management/${userId}`);
      }
    },
    [navigate],
  );

  const refreshGrid = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    api.purgeInfiniteCache();
    api.ensureIndexVisible(0, 'top');
  }, []);

  const dataSource = useMemo(
    (): IDatasource => ({
      getRows: async (params: IGetRowsParams) => {
        const page = Math.floor(params.startRow / PAGE_SIZE) + 1;
        // 첫 페이지 요청일 때만 로딩 오버레이 표시
        if (params.startRow === 0) {
          gridRef.current?.api?.showLoadingOverlay();
        }
        try {
          const response = await getUserList({
            page,
            pageSize: PAGE_SIZE,
            keyword: searchParamsRef.current.keyword,
            platform: searchParamsRef.current.platform,
            verificationStatus: searchParamsRef.current.business_verification_status,
          });

          const { results, count } = response;
          const lastRow = params.startRow + results.length >= count ? count : undefined;

          params.successCallback(results, lastRow);

          // 데이터가 없을 때 Empty 오버레이 표시
          if (results.length === 0 && params.startRow === 0) {
            gridRef.current?.api?.showNoRowsOverlay();
          } else {
            gridRef.current?.api?.hideOverlay();
          }
        } catch (error) {
          console.error('Failed to fetch user list:', error);
          params.failCallback();
          gridRef.current?.api?.hideOverlay();
        }
      },
    }),
    [],
  );

  const handleGridReady = useCallback(
    (params: GridReadyEvent) => {
      params.api.setGridOption('datasource', dataSource);
    },
    [dataSource],
  );

  const handleSearch = useCallback(
    (params: SearchParams) => {
      searchParamsRef.current = { ...searchParamsRef.current, keyword: params.keyword };
      refreshGrid();
    },
    [refreshGrid],
  );

  const handleSearchReset = useCallback(() => {
    if (!searchParamsRef.current.keyword) return;

    searchParamsRef.current = { ...searchParamsRef.current, keyword: undefined };
    refreshGrid();
  }, [refreshGrid]);

  const handleFilter = useCallback(
    (params: Record<string, string>) => {
      searchParamsRef.current = { ...searchParamsRef.current, ...params };
      refreshGrid();
    },
    [refreshGrid],
  );

  const handleFilterReset = useCallback(() => {
    const { keyword, ...filterParams } = searchParamsRef.current;
    const hasAnyFilterValue = Object.values(filterParams).some((value) => value);
    if (!hasAnyFilterValue) return;

    searchParamsRef.current = { keyword };
    refreshGrid();
  }, [refreshGrid]);

  return (
    <div className="flex h-full w-full flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <SearchBar onSearch={handleSearch} onReset={handleSearchReset} />
        <Button onClick={() => navigate('/user-management/create')}>사용자 생성</Button>
      </div>
      <Filter fields={USER_FILTERS} onFilter={handleFilter} onReset={handleFilterReset} />
      <AgGridReact<UserRow>
        ref={gridRef}
        rowModelType="infinite"
        cacheBlockSize={PAGE_SIZE}
        maxBlocksInCache={10}
        cacheOverflowSize={1}
        maxConcurrentDatasourceRequests={1}
        columnDefs={columnDefs}
        onGridReady={handleGridReady}
        onRowClicked={handleRowClicked}
        defaultColDef={{
          flex: 1,
          minWidth: 100,
          resizable: true,
          sortable: false,
          suppressMovable: true,
        }}
        suppressCellFocus={true}
        loadingOverlayComponent={Loading}
        noRowsOverlayComponent={Empty}
        animateRows={false}
        suppressRowTransform={true}
        rowClass="cursor-pointer"
      />
    </div>
  );
}
