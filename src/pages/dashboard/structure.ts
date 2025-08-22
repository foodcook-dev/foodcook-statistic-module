export const STAT_LIST = [
  {
    title: () => '실시간 매출액',
    unit: '원',
    tooltip: () => '금일 00시부터 현재까지의 실시간 매출액입니다',
    id: 'realtime_revenue',
    isHighlight: true,
  },
  {
    title: (isRealtime?: boolean) => (isRealtime ? '출고 매출액' : '매출액'),
    unit: '원',
    tooltip: (isRealtime?: boolean) =>
      isRealtime ? '금일 출고기준 매출액입니다' : '기간내 총 매출액입니다',
    id: 'total_revenue',
    isHighlight: false,
  },
  {
    title: (isRealtime?: boolean) => (isRealtime ? '주문 유저수' : '평균 주문 유저수'),
    unit: '명',
    tooltip: (isRealtime?: boolean) =>
      isRealtime ? '금일 출고기준 주문 유저수입니다' : '기간내 평균 주문 유저수입니다',
    id: 'average_user_count',
    isHighlight: false,
  },
  {
    title: () => '평균 주문금액',
    unit: '원',
    tooltip: () => '유저당 평균 주문금액입니다',
    id: 'average_order_amount',
    isHighlight: false,
  },
  {
    title: (isRealtime?: boolean) => (isRealtime ? '총 재고자산' : '평균 재고자산'),
    unit: '원',
    tooltip: (isRealtime?: boolean) =>
      isRealtime ? '재고관리상품으로 보유중인 실시간 재고자산입니다' : '기간내 평균 재고자산입니다',
    id: 'inventory_asset',
    isHighlight: true,
  },
];
