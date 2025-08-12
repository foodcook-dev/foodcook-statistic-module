import { type AgChartOptions } from 'ag-charts-community';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useDashboardData } from '@/pages/dashboard/hooks/useDashboardData';
import { useMemo } from 'react';
import { startOfMonth, format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface UseDashboardParams {
  partnerId?: number;
}

export const useDashboard = ({ partnerId }: UseDashboardParams = {}) => {
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | undefined>();
  const [period, setPeriod] = useState<string>('realtime');
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
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

  const chartOptions: AgChartOptions = useMemo(
    () => ({
      data: chartData,
      axes: [
        {
          type: 'category' as any,
          position: 'bottom',
        },
        {
          type: 'number' as any,
          position: 'left',
          label: {
            formatter: (params: any) => {
              return params.value.toLocaleString() + ' 원';
            },
          },
        },
      ],
      series: [
        {
          type: 'bar' as any,
          xKey: 'date',
          yKey: 'revenue',
          yName: '매출액',
          fill: '#F6A5A5',
          fillOpacity: 0.9,
        },
        {
          type: 'bar' as any,
          xKey: 'date',
          yKey: 'purchase',
          yName: '매입액',
          fill: '#6EC6A9',
          fillOpacity: 0.9,
        },
        {
          type: 'line' as any,
          xKey: 'date',
          yKey: 'margin',
          yName: '매출 총 이익',
          stroke: '#FFD54F',
          strokeWidth: 3,
          marker: {
            enabled: true,
            size: 10,
            fill: '#FFD54F',
            stroke: '#ffffff',
            strokeWidth: 2,
          },
        },
      ],
    }),
    [chartData],
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
