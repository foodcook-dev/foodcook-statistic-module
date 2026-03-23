import { FilterField } from '@/types/filter';

export const USER_FILTERS: FilterField[] = [
  {
    name: 'platform',
    label: '플랫폼',
    options: [
      { label: '전체', value: 'all' },
      { label: '브랜드쿡', value: 'brandcook' },
      { label: '식자재쿡', value: 'foodcook' },
    ],
    defaultValue: 'all',
  },
  {
    name: 'business_verification_status',
    label: '사업자 인증 상태',
    options: [
      { label: '전체', value: 'all' },
      { label: '인증', value: 'verified' },
      { label: '미인증', value: 'unverified' },
    ],
    defaultValue: 'all',
  },
];
