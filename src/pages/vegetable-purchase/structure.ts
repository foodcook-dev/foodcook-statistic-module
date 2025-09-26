// readonly 열 설정 (0: 매입사, 1: 상품ID, 2: 상품명, 3: 판매수량, 5: 평균판매금액, 6: 판매설정금액, 7: 기준매입단가)
export const readOnlyColumns = [0, 1, 2, 3, 5, 6, 7];
// 기대하는 열 key 순서
export const expectedKeys = [
  'buy_company_name',
  'product_id',
  'product_name',
  'sell_count',
  'buy_count',
  'avg_price',
  'set_sale_price',
  'master_purchase_price',
  'purchase_price',
  'total_purchase_price',
  'flag',
];

export const spreadsheetHeader = [
  '매입사',
  '상품ID',
  '상품명',
  '판매수량',
  '매입수량',
  '평균판매금액',
  '판매설정금액',
  '기준매입단가',
  '매입단가',
  '합계금액',
  '기준매입단가 수정여부',
];
