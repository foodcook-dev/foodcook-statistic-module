import { type AgChartOptions } from 'ag-charts-community';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useDashboardData } from '@/pages/dashboard/hooks/useDashboardData';
import { useMemo } from 'react';
import { startOfMonth, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTheme } from '@/components/modules/theme-provider';

interface UseDashboardParams {
  partnerId?: number;
}

export const useDashboard = ({ partnerId }: UseDashboardParams = {}) => {
  const { theme } = useTheme();
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | undefined>();
  const [period, setPeriod] = useState<string>('realtime');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { data: dashboardData, refetch } = useDashboardData({
    startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    partnerId,
  });

  useEffect(() => {
    if (dashboardData) setLastUpdateDate(new Date());
  }, [dashboardData]);

  const chartData = useMemo(() => {
    if (!dashboardData?.chart_data) return [];

    return dashboardData.chart_data.map((item) => ({
      date: format(new Date(item.date), 'MM/dd[EEE]', { locale: ko }),
      revenue: item.sales_amount,
      purchase: item.purchase_amount,
      profit: item.sales_amount - item.purchase_amount,
      margin: item.sales_amount * (dashboardData.gross_profit_margin / 100),
      costRatio: item.cost_to_sales_ratio,
    }));
  }, [dashboardData]);

  const themeColors = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      background: isDark ? '#111827' : '#ffffff',
      text: isDark ? '#ffffff' : '#000000',
      markerStroke: isDark ? '#1a1b23' : '#ffffff',
      revenue: isDark ? '#F687B3' : '#F6A5A5',
      purchase: isDark ? '#4FD1C7' : '#6EC6A9',
      profit: isDark ? '#F6E05E' : '#FFD54F',
    };
  }, [theme]);

  const createAxes = useMemo(
    () => [
      {
        type: 'category' as const,
        position: 'bottom' as const,
        label: {
          color: themeColors.text,
        },
      },
      {
        type: 'number' as const,
        position: 'left' as const,
        label: {
          formatter: (params: any) => `${params.value.toLocaleString()} 원`,
          color: themeColors.text,
        },
      },
    ],
    [themeColors.text],
  );

  const createSeries = useMemo(
    () => [
      {
        type: 'bar' as const,
        xKey: 'date',
        yKey: 'revenue',
        yName: '매출액',
        fill: themeColors.revenue,
        fillOpacity: 0.9,
      },
      {
        type: 'bar' as const,
        xKey: 'date',
        yKey: 'purchase',
        yName: '매입액',
        fill: themeColors.purchase,
        fillOpacity: 0.9,
      },
      {
        type: 'line' as const,
        xKey: 'date',
        yKey: 'margin',
        yName: '매출 총 이익',
        stroke: themeColors.profit,
        strokeWidth: 3,
        marker: {
          enabled: true,
          size: 10,
          fill: themeColors.profit,
          stroke: themeColors.markerStroke,
          strokeWidth: 2,
        },
      },
    ],
    [themeColors],
  );

  const chartOptions: AgChartOptions = useMemo(
    () => ({
      data: chartData,
      background: {
        fill: themeColors.background,
      },
      axes: createAxes,
      series: createSeries,
      legend: {
        enabled: true,
        position: 'bottom',
        item: {
          label: {
            color: themeColors.text,
          },
        },
      },
    }),
    [chartData, themeColors, createAxes, createSeries],
  );

  return {
    lastUpdateDate,
    period,
    dateRange,
    chartOptions,
    dashboardData,
    refetch,
    setPeriod,
    setDateRange,
  };
};
