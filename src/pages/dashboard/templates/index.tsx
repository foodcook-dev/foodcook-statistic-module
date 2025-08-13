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
// import { ThemeToggle } from '@/components/modules/theme-toggle';

export default function Dashboard() {
  const {
    chartOptions,
    dashboardData,
    lastUpdateDate,
    period,
    dateRange,
    setPeriod,
    setDateRange,
    partners,
    selectedPartnerId,
    handlePartnerChange,
  } = useDashboard();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Select
          value={selectedPartnerId ? selectedPartnerId.toString() : 'all'}
          onValueChange={handlePartnerChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="파트너사 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 파트너사</SelectItem>
            {partners.map((partner) => (
              <SelectItem
                key={partner.partner_company_id}
                value={partner.partner_company_id.toString()}
              >
                {partner.b_nm}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">실시간</SelectItem>
              <SelectItem value="select">기간 선택</SelectItem>
            </SelectContent>
          </Select>
          {period === 'select' && (
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STAT_LIST.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={Number(dashboardData?.[stat.value as keyof typeof dashboardData])}
            unit={stat.unit}
            tooltip={stat.tooltip}
            isRealtime={stat.isRealtime}
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
        <DetailCard data={dashboardData} />
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
