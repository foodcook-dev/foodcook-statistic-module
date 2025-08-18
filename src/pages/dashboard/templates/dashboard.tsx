import { AgCharts } from 'ag-charts-react';
import { DateRangePicker } from '@/components/modules/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import StatCard from '../modules/stat-card';
import DetailCard from '../modules/detail-card';
import { useDashboard } from '../hooks/useDashboard';
import { STAT_LIST } from '../structure';

interface DashboardProps {
  isSelectable?: boolean;
}

export default function Dashboard({ isSelectable = false }: DashboardProps) {
  const {
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
            value={selectedPartnerId ? selectedPartnerId.toString() : 'all'}
            onValueChange={handlePartnerChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="파트너사 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">식자재쿡</SelectItem>
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

        <div className="ml-auto flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STAT_LIST.map((stat) => (
          <StatCard
            key={stat.value}
            stat={stat}
            value={Number(dashboardData?.[stat.value as keyof typeof dashboardData])}
            periodType={periodType}
          />
        ))}
      </div>

      <div className="grid h-[600px] grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-background border-border/50 flex h-full flex-col gap-3 rounded-lg border p-6 shadow-sm lg:col-span-2">
          <h3 className="border-border/50 text-contrast border-b pb-2 text-lg font-semibold">
            매출 통계
          </h3>
          <AgCharts className="flex-1" options={chartOptions} />
        </div>
        <DetailCard data={dashboardData} periodType={periodType} dateRange={dateRange} />
      </div>

      <div className="flex items-center justify-end gap-2 rounded-lg p-2 px-4">
        <div className="text-sm text-gray-400">
          {lastUpdateDate?.toLocaleTimeString()
            ? `마지막 업데이트 : ${lastUpdateDate?.toLocaleTimeString()}`
            : '-'}
        </div>
      </div>
    </div>
  );
}
