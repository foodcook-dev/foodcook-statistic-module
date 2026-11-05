import { ServerCompanyType, SettlementType } from '@/types/settlement';

// 서버 매입사 유형
export const SETTLEMENT_TYPE_BY_SERVER_TYPE: Record<ServerCompanyType, SettlementType> = {
  buy: 'direct',
  partner: 'consignment',
};

// 정산 구분별 대시보드 화면 경로
export const SETTLEMENT_PATH: Record<SettlementType, string> = {
  direct: '/direct',
  consignment: '/consignment',
};
