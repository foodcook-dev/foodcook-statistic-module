import { AgCharts } from 'ag-charts-react';
import { ChartColumnBig } from 'lucide-react';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import LoadingSpinner from '@/components/atoms/loading-spinner';
import StatCard from '../modules/stat-card';
import DetailCard from '../modules/detail-card';
import { useDashboard } from '../hooks/useDashboard';
// import { ThemeToggle } from '@/components/modules/theme-toggle';

interface DashboardProps {
  isSelectable?: boolean;
}

export default function Dashboard({ isSelectable = false }: DashboardProps) {
  const {
    isLoading,
    isFetching,
    chartOptions,
    dashboardData,
    partners,
    selectedPartnerId,
    periodType,
    dateRange,
    lastUpdateDate,
    setDateRange,
    handlePartnerChange,
    handlePeriodChange,
  } = useDashboard({ isSelectable });

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        {isSelectable && (
          <Select
            value={selectedPartnerId ? selectedPartnerId.toString() : 'default'}
            onValueChange={handlePartnerChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="파트너사 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">식자재쿡</SelectItem>
              {partners?.map((partner: any) => (
                <SelectItem
                  key={partner.partner_company_id}
                  value={partner.partner_company_id.toString()}
                >
                  {partner.b_nm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-2">
          <Select value={periodType} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">실시간</SelectItem>
              <SelectItem value="period">기간 선택</SelectItem>
            </SelectContent>
          </Select>
          {periodType === 'period' && (
            <DateRangePicker
              date={dateRange}
              onDateSelect={({ from, to }) => setDateRange({ from, to })}
              contentAlign="end"
              maxDateType="today"
              isDashboard
            />
          )}
        </div>
        {/* <ThemeToggle /> */}
      </div>

      <StatCard
        isLoading={isLoading}
        isFetching={isFetching}
        data={dashboardData}
        periodType={periodType}
      />

      <div className="grid h-[600px] grid-cols-3 gap-6">
        <div className="bg-background border-border/50 col-span-2 flex h-full flex-col gap-3 rounded-lg border p-6 shadow-sm">
          <h3 className="border-border/50 text-contrast border-b pb-2 text-lg font-semibold">
            매출 통계
          </h3>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : dashboardData?.chart_data.length > 0 ? (
              <AgCharts className="h-full" options={chartOptions} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-center">
                  <ChartColumnBig className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    선택한 기간에 해당하는 데이터가 없습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DetailCard
          isLoading={isLoading}
          isFetching={isFetching}
          data={dashboardData}
          periodType={periodType}
          dateRange={dateRange}
        />
      </div>

      <div className="flex justify-end gap-2 text-sm text-gray-400">
        {lastUpdateDate?.toLocaleTimeString()
          ? `마지막 업데이트 : ${lastUpdateDate?.toLocaleTimeString()}`
          : '-'}
      </div>
    </div>
  );
}
