import { type AgChartOptions } from 'ag-charts-community';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { DateRange } from 'react-day-picker';
import { useDashboardData } from '@/pages/dashboard/hooks/useDashboardData';
import { startOfMonth, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTheme } from '@/components/modules/theme-provider';

interface UseDashboardParams {
  partnerId?: number;
}

export const useDashboard = ({ partnerId: initialPartnerId }: UseDashboardParams = {}) => {
  const { theme } = useTheme();
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | undefined>(initialPartnerId);
  const [periodType, setPeriodType] = useState<string>('realtime');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: '/dashboard/companies/',
      }),
  });

  const { data: dashboardData, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard', selectedPartnerId, dateRange.from, dateRange.to],
    queryFn: () => {
      return createAxios({
        method: 'get',
        endpoint: `/dashboard/main_by_company/`,
        params: {
          start_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
          end_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
          partner_company_id: selectedPartnerId,
        },
      });
    },
    enabled: !!dateRange.from && !!dateRange.to,
    staleTime: 0, // 데이터를 항상 stale로 간주하여 자동 리페치 허용
    gcTime: 20 * 60 * 1000, // 20분간 캐시 유지 (구 cacheTime)
    refetchOnWindowFocus: true,
    refetchInterval: 600 * 1000, // 10분마다 자동 리페치
    refetchIntervalInBackground: true, // 백그라운드에서도 리페치 실행
    retry: 2,
  });

  // const { data: dashboardData, refetch } = useDashboardData({
  //   startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
  //   endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  //   partnerId: selectedPartnerId,
  // });

  const handlePartnerChange = (partnerId: string) => {
    const id = partnerId === 'all' ? undefined : Number(partnerId);
    setSelectedPartnerId(id);
  };

  const handlePeriodChange = (period: string) => {
    setPeriodType(period);
    setDateRange({
      from: startOfMonth(new Date()),
      to: new Date(),
    });
  };

  const lastUpdateDate = useMemo(() => {
    return dataUpdatedAt ? new Date(dataUpdatedAt) : undefined;
  }, [dataUpdatedAt]);

  const chartData = useMemo(() => {
    if (!dashboardData?.chart_data) return [];

    return dashboardData.chart_data.map((item: any) => ({
      date: format(new Date(item.date), 'MM/dd[EEE]', { locale: ko }),
      revenue: item.sales_amount,
      purchase: item.purchase_amount,
      profit: item.sales_amount - item.purchase_amount,
      margin: item.gross_profit_margin,
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
    selectedPartnerId,
    partners,
    lastUpdateDate,
    periodType,
    dateRange,
    chartOptions,
    dashboardData,
    setDateRange,
    handlePartnerChange,
    handlePeriodChange,
  };
};
