import { SubBusinessDetail } from '@/types/user-management';

// 종사업장 정보가 실제로 등록되어 있는지 판별 헬퍼
export function hasSubBusinessInfo(
  info: SubBusinessDetail | Record<string, never> | null | undefined,
): info is SubBusinessDetail {
  return !!info && Object.keys(info).length > 0;
}
