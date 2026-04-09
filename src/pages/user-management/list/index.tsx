import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [count, setCount] = useState<{
    userCount: number;
    businessVerifiedCount: number;
    personallyVerifiedCount: number;
  }>({
    userCount: 0,
    businessVerifiedCount: 0,
    personallyVerifiedCount: 0,
  });

  // URL에서 초기값 읽기
  const searchParamsRef = useRef<SearchParams>({
    keyword: searchParams.get('keyword') ?? undefined,
    platform: searchParams.get('platform') ?? undefined,
    business_verification_status: searchParams.get('business_verification_status') ?? undefined,
  });

  // URL 파라미터 업데이트 헬퍼
  const updateSearchParams = useCallback(
    (params: SearchParams) => {
      const next = new URLSearchParams();
      if (params.keyword) next.set('keyword', params.keyword);
      if (params.platform) next.set('platform', params.platform);
      if (params.business_verification_status)
        next.set('business_verification_status', params.business_verification_status);
      setSearchParams(next, { replace: true });
    },
    [setSearchParams],
  );

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<UserRow>) => {
      const userId = event.data?.id;
      const companyId = event.data?.sales_company_id;
      if (userId) {
        navigate(`/user-management/${userId}`, {
          state: { companyId },
        });
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

          const { results, count, business_verified_count, nice_verified_count } = response;
          setCount({
            userCount: count,
            businessVerifiedCount: business_verified_count,
            personallyVerifiedCount: nice_verified_count,
          });
          const lastRow = params.startRow + results.length >= count ? count : undefined;
          params.successCallback(results, lastRow);

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
      updateSearchParams(searchParamsRef.current);
      refreshGrid();
    },
    [refreshGrid, updateSearchParams],
  );

  const handleSearchReset = useCallback(() => {
    if (!searchParamsRef.current.keyword) return;
    searchParamsRef.current = { ...searchParamsRef.current, keyword: undefined };
    updateSearchParams(searchParamsRef.current);
    refreshGrid();
  }, [refreshGrid, updateSearchParams]);

  const handleFilter = useCallback(
    (params: Record<string, string>) => {
      searchParamsRef.current = { ...searchParamsRef.current, ...params };
      updateSearchParams(searchParamsRef.current);
      refreshGrid();
    },
    [refreshGrid, updateSearchParams],
  );

  const handleFilterReset = useCallback(() => {
    const { keyword, ...filterParams } = searchParamsRef.current;
    const hasAnyFilterValue = Object.values(filterParams).some((value) => value);
    if (!hasAnyFilterValue) return;

    searchParamsRef.current = { keyword };
    updateSearchParams(searchParamsRef.current);
    refreshGrid();
  }, [refreshGrid, updateSearchParams]);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <SearchBar
          onSearch={handleSearch}
          onReset={handleSearchReset}
          defaultValue={searchParamsRef.current.keyword}
          placeholder="사용자 ID, 닉네임, 상호명, 프랜차이즈를 검색하세요"
        />
        <Button onClick={() => navigate('/user-management/create')}>사용자 생성</Button>
      </div>
      <div className="flex gap-4">
        <div className="bg-background flex-1 rounded-md border px-4 py-3">
          <p className="text-contrast/60 text-sm">사용자 수</p>
          <p className="text-lg font-bold">{count.userCount.toLocaleString()}</p>
        </div>
        <div className="bg-background flex-1 rounded-md border px-4 py-3">
          <p className="text-contrast/60 text-sm">사업자 인증 완료 사용자 수</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold">{count.businessVerifiedCount.toLocaleString()}</p>
            <p className="text-contrast/30 text-sm">
              ({((count.businessVerifiedCount / count.userCount) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
        <div className="bg-background flex-1 rounded-md border px-4 py-3">
          <p className="text-contrast/60 text-sm">본인 인증 완료 사용자 수</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold">{count.personallyVerifiedCount.toLocaleString()}</p>
            <p className="text-contrast/30 text-sm">
              ({((count.personallyVerifiedCount / count.userCount) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>
      <Filter
        fields={USER_FILTERS}
        onFilter={handleFilter}
        onReset={handleFilterReset}
        defaultValues={{
          platform: searchParamsRef.current.platform ?? '',
          business_verification_status: searchParamsRef.current.business_verification_status ?? '',
        }}
      />
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
