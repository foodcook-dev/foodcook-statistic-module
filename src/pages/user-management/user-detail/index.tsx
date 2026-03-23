import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getUserDetail } from '@/libs/user-management-api';

type VerificationBadgeProps = {
  verified: boolean;
  label: string;
  verifiedColor: 'emerald' | 'blue';
};

function VerificationBadge({ verified, label, verifiedColor }: VerificationBadgeProps) {
  const colorMap = {
    emerald: {
      verified: 'bg-background text-emerald-500 ring-emerald-500/15',
      dot: 'bg-emerald-400',
    },
    blue: {
      verified: 'bg-background text-blue-500 ring-blue-500/15',
      dot: 'bg-blue-400',
    },
  };

  const colors = colorMap[verifiedColor];

  return verified ? (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ring-1 ${colors.verified}`}
    >
      {label} 완료
    </span>
  ) : (
    <span className="bg-background text-contrast/50 ring-contrast/10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1">
      {label} 미완료
    </span>
  );
}

export default function UserManagementDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: userInfo } = useQuery({
    queryKey: ['userDetail', id],
    queryFn: () => getUserDetail(Number(id)),
    enabled: !!id,
  });

  if (!userInfo) return null;

  const formatDate = (iso: string) => dayjs(iso).format('YYYY년 MM월 DD일 HH:mm');
  const formatPhone = (num: string) => num.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex w-full max-w-[350px] flex-col gap-2.5">
        <div className="bg-background border-border overflow-hidden rounded-xl border shadow-sm">
          <div className="border-border bg-foreground flex items-center gap-3.5 border-b px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-contrast text-xl font-medium">{userInfo.username}</p>
              <p className="text-contrast/70 mt-0.5 text-[14px]">
                @{userInfo.nickname} · #{userInfo.id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <VerificationBadge
                verified={userInfo.is_sales_verified}
                label="사업자 인증"
                verifiedColor="emerald"
              />
              <VerificationBadge
                verified={userInfo.is_nice_verified}
                label="NICE 인증"
                verifiedColor="blue"
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="border-border border-b px-5 py-4">
            <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">기본 정보</p>
            <div className="w-full border-collapse text-[12px]">
              <InfoRow label="상호명" value={userInfo.b_nm} />
              <InfoRow label="연락처" value={formatPhone(userInfo.phone_num)} />
              <InfoRow label="이메일" value={userInfo.email ?? undefined} fallback="미등록" />
              <InfoRow label="추천인" value={userInfo.recommender ?? undefined} fallback="없음" />
              <InfoRow
                label="추천 코드"
                value={userInfo.referral_code ?? undefined}
                fallback="없음"
              />
              <InfoRow
                label="지난달 매출"
                value={`${userInfo.last_month_sales.toLocaleString()}원`}
              />
              <InfoRow label="가입일" value={formatDate(userInfo.date_joined)} />
            </div>
          </div>

          {/* NICE 인증 정보 */}
          {userInfo.nice_verification_info && (
            <div className="px-5 py-4">
              <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">
                NICE 본인인증 정보
              </p>
              <div className="w-full border-collapse text-[12px]">
                <InfoRow label="인증기관" value={userInfo.nice_verification_info.authority} />
                <InfoRow label="이름" value={userInfo.nice_verification_info.name} />
                <InfoRow
                  label="생년월일"
                  value={dayjs(userInfo.nice_verification_info.birthdate).format(
                    'YYYY년 MM월 DD일',
                  )}
                />
                <InfoRow label="성별" value={userInfo.nice_verification_info.gender} />
                <InfoRow label="국적" value={userInfo.nice_verification_info.national_info} />
                <InfoRow label="통신사" value={userInfo.nice_verification_info.mobile_co} />
                <InfoRow
                  label="인증 번호"
                  value={formatPhone(userInfo.nice_verification_info.mobile_no)}
                />
                <InfoRow
                  label="인증일시"
                  value={formatDate(userInfo.nice_verification_info.verified_at)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  fallback = '-',
}: {
  label: string;
  value?: string;
  fallback?: string;
}) {
  return (
    <div className="flex">
      <div className="text-contrast/70 w-[50%] py-[5px]">{label}</div>
      <div className="text-contrast py-[5px] font-medium">{value ?? fallback}</div>
    </div>
  );
}
