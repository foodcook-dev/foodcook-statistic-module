export const STAT_LIST = [
  {
    title: () => '실시간 매출액',
    unit: '원',
    tooltip: () => '금일 00시부터 현재까지의 실시간 매출액입니다',
    value: 'realtime_revenue',
    isHighlight: true,
  },
  {
    title: () => '출고 매출액',
    unit: '원',
    tooltip: () => '금일 출고기준 총 매출액입니다',
    value: 'total_revenue',
    isHighlight: false,
  },
  {
    title: (isRealtime?: boolean) => (isRealtime ? '주문 유저수' : '평균 주문 유저수'),
    unit: '명',
    tooltip: (isRealtime?: boolean) =>
      isRealtime ? '금일 출고기준 주문 유저수입니다' : '선택된 기간의 평균 주문 유저수입니다',
    value: 'unique_user_count',
    isHighlight: false,
  },
  {
    title: () => '평균 주문금액',
    unit: '원',
    tooltip: () => '유저당 평균 주문금액입니다',
    value: 'average_order_amount',
    isHighlight: false,
  },
  {
    title: (isRealtime?: boolean) => (isRealtime ? '총 재고자산' : '평균 재고자산'),
    unit: '원',
    tooltip: (isRealtime?: boolean) =>
      isRealtime
        ? '3000개 미만(재고관리상품)으로 보유하고 있는 재고자산입니다'
        : '선택된 기간의 평균 재고자산입니다',
    value: 'inventory_asset',
    isHighlight: true,
  },
];
