import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import dayjs from 'dayjs';
import { VerificationBadge } from '@/components/modules/user-management/VerificationBadge';
import { InfoRow } from './InfoRow';

export default function UserCard({ userId, data }: { userId: string; data: any }) {
  const navigate = useNavigate();
  const formatDate = (iso: string) => dayjs(iso).format('YYYY년 MM월 DD일 HH:mm');
  const formatPhone = (num: string) => num.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');

  return (
    <div className="bg-background border-border overflow-hidden rounded-md border shadow-sm">
      <div className="border-border bg-foreground flex h-[80px] items-center gap-3.5 border-b pr-3 pl-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-contrast text-md truncate font-medium">{data.username}</p>
            <button
              onClick={() => navigate(`/user-management/${userId}/edit`)}
              className="text-contrast hover:text-contrast/50 border-border flex shrink-0 items-center gap-1 rounded-md border p-1 transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          <p className="text-contrast/70 mt-0.5 truncate text-[13px]">{data.nickname}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <VerificationBadge
            verified={data.is_sales_verified}
            label="사업자 인증"
            verifiedColor="emerald"
          />
          <VerificationBadge
            verified={data.is_nice_verified}
            label="NICE 인증"
            verifiedColor="blue"
          />
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="border-border border-b px-5 py-4">
        <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">기본 정보</p>
        <div className="text-[12px]">
          <InfoRow label="상호명" value={data.b_nm} />
          <InfoRow label="연락처" value={formatPhone(data.phone_num)} />
          <InfoRow label="이메일" value={data.email ?? undefined} />
          <InfoRow label="추천인" value={data.recommender_display ?? undefined} />
          <InfoRow label="추천 코드" value={data.referral_code ?? undefined} />
          <InfoRow label="지난달 매출" value={`${data.last_month_sales.toLocaleString()}원`} />
          <InfoRow label="가입일" value={formatDate(data.date_joined)} />
        </div>
      </div>

      {/* NICE 인증 정보 */}
      {data.nice_verification_info && (
        <div className="px-5 py-4">
          <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">
            NICE 본인인증 정보
          </p>
          <div className="text-[12px]">
            <InfoRow label="인증기관" value={data.nice_verification_info.authority} />
            <InfoRow label="이름" value={data.nice_verification_info.name} />
            <InfoRow
              label="생년월일"
              value={dayjs(data.nice_verification_info.birthdate).format('YYYY년 MM월 DD일')}
            />
            <InfoRow label="성별" value={data.nice_verification_info.gender} />
            <InfoRow label="국적" value={data.nice_verification_info.national_info} />
            <InfoRow label="통신사" value={data.nice_verification_info.mobile_co} />
            <InfoRow label="인증 번호" value={formatPhone(data.nice_verification_info.mobile_no)} />
            <InfoRow label="인증일시" value={formatDate(data.nice_verification_info.verified_at)} />
          </div>
        </div>
      )}
    </div>
  );
}
