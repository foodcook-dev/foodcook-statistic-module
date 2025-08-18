import { type AgChartOptions } from 'ag-charts-community';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTheme } from '@/components/modules/theme-provider';

interface UseDashboardOptions {
  isSelectable: boolean;
}

export const useDashboard = ({ isSelectable }: UseDashboardOptions) => {
  const { theme } = useTheme();
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | undefined>(undefined);
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
    enabled: isSelectable,
  });

  const { data: dashboardData, dataUpdatedAt } = useQuery({
    queryKey: [
      'dashboard',
      periodType,
      selectedPartnerId,
      dateRange.from,
      dateRange.to,
      isSelectable,
    ],
    queryFn: () => {
      const endpoint = isSelectable ? '/dashboard/main_by_company/' : '/dashboard/main/';
      const params: any = {
        start_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
        end_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
        type: periodType,
      };

      if (isSelectable) params.partner_company_id = selectedPartnerId;

      return createAxios({
        method: 'get',
        endpoint,
        params,
      });
    },
    enabled: !!dateRange.from && !!dateRange.to,
    staleTime: periodType === 'realtime' ? 0 : 5 * 60 * 1000, // realtime일 때만 항상 stale
    gcTime: 20 * 60 * 1000, // 20분간 캐시 유지
    refetchOnWindowFocus: periodType === 'realtime', // realtime일 때만 포커스 시 리페치
    refetchInterval: periodType === 'realtime' ? 600 * 1000 : false, // realtime일 때만 10분마다 자동 리페치
    refetchIntervalInBackground: periodType === 'realtime', // realtime일 때만 백그라운드 리페치
    retry: 2,
  });

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

  const createSeries = useMemo(() => {
    const baseSeries = [
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
    ];

    return baseSeries.filter((series) => {
      if (series.yKey === 'purchase') {
        return chartData.some((item: any) => item.purchase != null && item.purchase > 0);
      }
      if (series.yKey === 'margin') {
        return chartData.some((item: any) => item.margin != null && item.margin !== 0);
      }
      return true;
    });
  }, [themeColors, dashboardData]);

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
