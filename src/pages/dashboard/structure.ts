export const STAT_LIST = [
  {
    title: '실시간 매출액',
    unit: '원',
    tooltip: '금일 00시부터 현재까지의 실시간 매출액입니다',
    value: 'realtime_revenue',
    isRealtime: true,
  },
  {
    title: '출고 매출액',
    unit: '원',
    tooltip: '금일 출고기준 총 매출액입니다',
    value: 'total_revenue',
    isRealtime: false,
  },
  {
    title: '주문 유저수',
    unit: '명',
    tooltip: '금일 출고기준 주문 유저수입니다',
    value: 'unique_user_count',
    isRealtime: false,
  },
  {
    title: '평균 주문금액',
    unit: '원',
    tooltip: '금일 출고기준 유저당 평균 주문금액입니다',
    value: 'average_order_amount',
    isRealtime: false,
  },
  {
    title: '총 재고자산',
    unit: '원',
    tooltip: '현재 보유하고 있는 재고 자산입니다',
    value: 'inventory_asset',
    isRealtime: true,
  },
];
