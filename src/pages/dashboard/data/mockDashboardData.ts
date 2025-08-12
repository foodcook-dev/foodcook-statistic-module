import { DashboardApiResponse } from '@/pages/dashboard/types/dashboard';

export const mockDashboardData: DashboardApiResponse = {
  partner_company_id: 1001,
  partner_company_name: '푸드쿡 파트너사',
  realtime_revenue: 2450000,
  total_revenue: 58551046,
  unique_user_count: 342,
  average_order_amount: 42500,
  inventory_asset: 125000000,
  revenue: 58551046,
  partial_cancel_revenue: 850000,
  vat: 5855104,
  sales_revenue: 52695942,
  app_revenue: 45000000,
  external_revenue: 13551046,
  total_tax_amount: 53200000,
  total_tax_free_amount: 5351046,
  gross_profit_margin: 24.5,
  chart_data: [
    {
      date: '2025-08-04',
      sales_amount: 38871970,
      purchase_amount: 34165924,
      cost_to_sales_ratio: 88,
    },
    {
      date: '2025-08-05',
      sales_amount: 46597191,
      purchase_amount: 24106791,
      cost_to_sales_ratio: 52,
    },
    {
      date: '2025-08-06',
      sales_amount: 45416591,
      purchase_amount: 33574446,
      cost_to_sales_ratio: 74,
    },
    {
      date: '2025-08-07',
      sales_amount: 65431091,
      purchase_amount: 62370365,
      cost_to_sales_ratio: 95,
    },
    {
      date: '2025-08-08',
      sales_amount: 58551046,
      purchase_amount: 38173157,
      cost_to_sales_ratio: 65,
    },
    {
      date: '2025-08-09',
      sales_amount: 3895296,
      purchase_amount: 2862022,
      cost_to_sales_ratio: 73,
    },
    {
      date: '2025-08-10',
      sales_amount: 38642145,
      purchase_amount: 32000000,
      cost_to_sales_ratio: 83,
    },
  ],
};

// 다양한 파트너사 데이터 생성을 위한 헬퍼 함수
const generateRandomData = (partnerId: number, partnerName: string): DashboardApiResponse => {
  const baseRevenue = Math.floor(Math.random() * 100000000) + 20000000;
  const realtimeRevenue = Math.floor(Math.random() * 5000000) + 1000000;
  const userCount = Math.floor(Math.random() * 500) + 100;
  const avgOrderAmount = Math.floor(baseRevenue / userCount);

  return {
    partner_company_id: partnerId,
    partner_company_name: partnerName,
    realtime_revenue: realtimeRevenue,
    total_revenue: baseRevenue,
    unique_user_count: userCount,
    average_order_amount: avgOrderAmount,
    inventory_asset: Math.floor(Math.random() * 200000000) + 50000000,
    revenue: baseRevenue,
    partial_cancel_revenue: Math.floor(baseRevenue * 0.02), // 2% 환불률
    vat: Math.floor(baseRevenue * 0.1), // 10% 부가세
    sales_revenue: Math.floor(baseRevenue * 0.9),
    app_revenue: Math.floor(baseRevenue * 0.7),
    external_revenue: Math.floor(baseRevenue * 0.3),
    total_tax_amount: Math.floor(baseRevenue * 0.85),
    total_tax_free_amount: Math.floor(baseRevenue * 0.15),
    gross_profit_margin: Math.floor(Math.random() * 30) + 15, // 15-45% 마진
    chart_data: generateChartData(),
  };
};

// 차트 데이터 생성 함수
const generateChartData = () => {
  const chartData = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const salesAmount = Math.floor(Math.random() * 50000000) + 10000000;
    const purchaseAmount = Math.floor(salesAmount * (0.6 + Math.random() * 0.3)); // 60-90% 비율
    const costRatio = Math.floor((purchaseAmount / salesAmount) * 100);

    chartData.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD 형식
      sales_amount: salesAmount,
      purchase_amount: purchaseAmount,
      cost_to_sales_ratio: costRatio,
    });
  }

  return chartData;
};

// Mock API 함수 (실제 API 호출을 시뮬레이션)
export const fetchDashboardData = async (
  startDate?: string,
  endDate?: string,
  partnerId?: number,
): Promise<DashboardApiResponse> => {
  // 리패치 확인을 위한 로그
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `[${timestamp}] Dashboard API 호출 - partnerId: ${partnerId}, 날짜: ${startDate} ~ ${endDate}`,
  );

  // 실제 환경에서는 여기서 API 호출을 수행
  // 지금은 mock 데이터를 반환

  // 요청 파라미터에 따라 다른 데이터를 반환할 수 있음
  if (partnerId && partnerId !== mockDashboardData.partner_company_id) {
    const partnerName = `파트너사 ${partnerId}`;
    const generatedData = generateRandomData(partnerId, partnerName);

    // 날짜 범위에 따른 데이터 조정
    if (startDate && endDate) {
      console.log(`파트너 ${partnerId} 데이터 생성: ${startDate} ~ ${endDate}`);
      // 실제로는 날짜 범위에 따라 chart_data를 필터링하거나 재생성할 수 있음
    }

    // 실제 API 호출 시뮬레이션을 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

    console.log(`[${timestamp}] 파트너 ${partnerId} 데이터 반환 완료`);
    return generatedData;
  }

  // 날짜 범위에 따른 기본 데이터 조정
  let adjustedData = { ...mockDashboardData };
  if (startDate && endDate) {
    console.log(`기본 데이터 조정: ${startDate} ~ ${endDate}`);
    // 날짜 범위에 따라 차트 데이터를 필터링할 수 있음
    // 실제 구현에서는 startDate와 endDate 사이의 데이터만 반환
  }

  // 실시간 매출 데이터를 매번 변경해서 리패치 확인
  adjustedData.realtime_revenue = Math.floor(Math.random() * 5000000) + 1000000;
  adjustedData.unique_user_count = Math.floor(Math.random() * 500) + 100;

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

  console.log(
    `[${timestamp}] 기본 데이터 반환 완료 - 실시간 매출: ${adjustedData.realtime_revenue.toLocaleString()}원`,
  );
  return adjustedData;
};

export const getMockDataByDateRange = (
  startDate: string,
  endDate: string,
): DashboardApiResponse => {
  const data = { ...mockDashboardData };

  const start = new Date(startDate);
  const end = new Date(endDate);

  data.chart_data = data.chart_data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });

  const totalSales = data.chart_data.reduce((sum, item) => sum + item.sales_amount, 0);

  data.total_revenue = totalSales;
  data.revenue = totalSales;
  data.sales_revenue = Math.floor(totalSales * 0.9);

  return data;
};

export const getMockDataByPartner = (partnerId: number): DashboardApiResponse => {
  const partnerNames = [
    '푸드쿡 파트너사',
    '글로벌 식품',
    '프레시 마켓',
    '디럭스 푸드',
    '퀄리티 서플라이',
  ];

  const partnerName = partnerNames[partnerId % partnerNames.length] || `파트너사 ${partnerId}`;
  return generateRandomData(partnerId, partnerName);
};
