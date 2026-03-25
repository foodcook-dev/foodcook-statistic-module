export const PAYMENT_METHODS = [
  { key: 'is_meet_pay_available', label: '만나서 결제' },
  { key: 'is_card_pay_available', label: '카드 결제' },
  { key: 'is_deposit_pay_available', label: '예치금 결제' },
  { key: 'is_fixed_account_pay_available', label: '고정계좌 결제' },
] as const;

export const BRANCH_TOGGLE_FIELDS = [
  { field: 'is_active', label: '활성화 여부', onText: '활성화', offText: '비활성화' },
  { field: 'is_confirmed', label: '승인 여부', onText: '승인', offText: '미승인' },
  { field: 'is_default', label: '기본배송지', onText: '설정', offText: '미설정' },
] as const;
