import { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import { Check, X } from 'lucide-react';
import { UserRow } from './row-structure';

interface VerificationBadgeProps {
  verified: boolean;
}

export function VerificationBadge({ verified }: VerificationBadgeProps) {
  const colorClasses = verified ? 'bg-background text-emerald-500' : 'bg-background text-slate-600';
  return (
    <span className={`inline-flex rounded-full px-1 py-1 ${colorClasses}`}>
      {verified ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </span>
  );
}

export const columnDefs: ColDef<UserRow>[] = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.5,
    headerClass: 'centered',
    cellStyle: { textAlign: 'center' },
  },
  { headerName: '사용자 ID', field: 'username' },
  { headerName: '닉네임', field: 'nickname' },
  { headerName: '상호명', field: 'b_nm' },
  { headerName: '프랜차이즈', field: 'franchise_display' },
  { headerName: '이메일', field: 'email' },
  { headerName: '연락처', field: 'phone_num' },
  {
    headerName: '플랫폼',
    field: 'platform_display',
    flex: 0.7,
    headerClass: 'centered',
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  {
    headerName: '사업자인증',
    field: 'is_sales_verified',
    flex: 0.7,
    headerClass: 'centered',
    cellRenderer: (params: any) => <VerificationBadge verified={params.value} />,
    cellStyle: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    headerName: '본인인증',
    field: 'is_nice_verified',
    flex: 0.7,
    headerClass: 'centered',
    cellRenderer: (params: any) => <VerificationBadge verified={params.value} />,
    cellStyle: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    headerName: '가입일',
    field: 'date_joined',
    valueFormatter: (params) => {
      if (!params.value) return '';
      return dayjs(params.value).format('YYYY년 MM월 DD일 HH:mm:ss');
    },
  },
];
