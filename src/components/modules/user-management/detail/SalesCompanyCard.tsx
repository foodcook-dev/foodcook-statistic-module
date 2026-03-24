import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Building2, FileText, Pencil } from 'lucide-react';
import dayjs from 'dayjs';
import { postSalesCompanyConfirm } from '@/libs/user-management-api';
import { SalesCompanyDetailResponse } from '@/types/user-management';
import { DAYS } from '@/constants/user-management/day';
import { useAlert } from '@/hooks/useAlert';
import { useConfirm } from '@/hooks/useConfirm';
import { InfoRow } from './InfoRow';
import { BranchItem } from './BranchItem';

export default function SalesCompanyCard({
  companyId,
  data,
}: {
  companyId: number;
  data: SalesCompanyDetailResponse;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAlert = useAlert();
  const setConfirm = useConfirm();
  const formatDate = (iso: string) => dayjs(iso).format('YYYY년 MM월 DD일');

  const { mutate: confirmCompany } = useMutation({
    mutationFn: (confirm: boolean) => postSalesCompanyConfirm(companyId, confirm),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['salesCompanyDetail', companyId] });
      queryClient.invalidateQueries({ queryKey: ['userDetail'] });
      setAlert({ message: response.detail });
    },
  });

  const handleConfirm = (confirm: boolean) => {
    setConfirm({
      title: confirm ? '사업자 승인' : '사업자 승인 취소',
      message: confirm
        ? '사업자 승인을 진행하시겠습니까?'
        : '사업자 승인을 취소하시겠습니까? 승인 취소 시 해당 사업자는 활동이 제한됩니다.',
      confirmText: confirm ? '승인하기' : '승인 취소',
      onConfirm: () => confirmCompany(confirm),
    });
  };

  const isAllDays =
    !data.delivery_available_days || Object.keys(data.delivery_available_days).length === 0;

  const paymentMethods = [
    { label: '만나서 결제', value: data.is_meet_pay_available },
    { label: '카드', value: data.is_card_pay_available },
    { label: '계좌이체', value: data.is_deposit_pay_available },
    { label: '고정계좌', value: data.is_fixed_account_pay_available },
  ];

  return (
    <div className="bg-background border-border flex w-full max-w-[900px] flex-col overflow-hidden rounded-md border shadow-sm">
      <div className="border-border bg-foreground flex h-[80px] items-center gap-3 border-b px-5">
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Building2 className="text-primary h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-contrast text-md truncate font-medium">{data.b_nm}</p>
            <button
              onClick={() => navigate(`/user-management/sales-company/${companyId}/edit`)}
              className="text-contrast hover:text-contrast/50 border-border flex shrink-0 items-center gap-1 rounded-md border p-1 transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          <p className="text-contrast/60 text-[13px]">{data.platform_display}</p>
        </div>
        {data.is_confirmed ? (
          <button
            onClick={() => handleConfirm(false)}
            className="flex shrink-0 items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1.5 text-[12px] font-bold text-red-500"
          >
            승인 취소
          </button>
        ) : (
          <button
            onClick={() => handleConfirm(true)}
            className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-1.5 text-[12px] font-bold text-white"
          >
            사업자 승인
          </button>
        )}
      </div>

      {/* 사업장 정보 */}
      <div className="border-border border-b px-5 py-4">
        <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">사업장 정보</p>
        <div className="text-[12px]">
          <div className="flex items-center">
            <span className="text-contrast/70 w-[40%] py-[5px]">사업자등록증</span>
            {data.cert_image ? (
              <a
                href={data.cert_image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/70 flex items-center gap-1 py-[5px] text-[12px] font-medium transition-colors"
              >
                <FileText className="h-3.5 w-3.5" /> 파일 보기
              </a>
            ) : (
              <span className="text-contrast/40 py-[5px]">미등록</span>
            )}
          </div>
          <InfoRow label="사업자번호" value={data.b_no} />
          <InfoRow label="대표자명" value={data.owner_name} />
          <InfoRow label="업태" value={data.b_sector} />
          <InfoRow label="업종" value={data.b_type} />
          <InfoRow label="세금유형" value={data.tax_type_display} />
          <InfoRow label="개업일" value={data.start_dt && formatDate(data.start_dt)} />
          <InfoRow label="주소" value={data.address} />
          {data.franchise_display && <InfoRow label="프랜차이즈" value={data.franchise_display} />}
          {data.driver_display && <InfoRow label="배송기사" value={data.driver_display} />}
          {data.manager_display && <InfoRow label="담당자" value={data.manager_display} />}
          {data.note && <InfoRow label="비고" value={data.note} />}
        </div>
      </div>

      {/* 외부 연동 코드 */}
      {(data.dongwon_sales_company_code ||
        data.jette_sales_company_code ||
        data.foodist_sales_company_code) && (
        <div className="border-border border-b px-5 py-4">
          <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">
            외부 연동 코드
          </p>
          <div className="text-[12px]">
            {data.dongwon_sales_company_code && (
              <InfoRow label="동원 사업장 코드" value={data.dongwon_sales_company_code} />
            )}
            {data.jette_sales_company_code && (
              <InfoRow label="제때 사업장 코드" value={data.jette_sales_company_code} />
            )}
            {data.foodist_sales_company_code && (
              <InfoRow label="푸디스트 사업장 코드" value={data.foodist_sales_company_code} />
            )}
          </div>
        </div>
      )}

      {/* 배송 가능 요일 + 결제 수단 */}
      <div className="border-border flex border-b">
        <div className="flex-1 px-5 py-4">
          <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">
            배송 가능 요일
          </p>
          <div className="flex gap-1.5">
            {isAllDays ? (
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-[11px] font-semibold">
                모든요일 배송 가능
              </span>
            ) : (
              DAYS.map(({ id, name }) => {
                const available = (data.delivery_available_days as Record<string, boolean>)[id];
                return (
                  <span
                    key={id}
                    className={`rounded-md px-2 py-1 text-[11px] ${
                      available
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'bg-foreground text-contrast/50'
                    }`}
                  >
                    {name}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <div className="border-border flex-1 border-l px-5 py-4">
          <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">결제 수단</p>
          <div className="flex flex-wrap gap-1.5">
            {paymentMethods.map(({ label, value }) => (
              <span
                key={label}
                className={`rounded-md px-2 py-1 text-[11px] ${
                  value
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'bg-foreground text-contrast/50'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 지점 목록 */}
      {!!data.sales_branch_info?.length && (
        <div className="px-5 py-4">
          <p className="text-contrast/90 mb-2.5 text-sm font-medium tracking-widest">
            지점 정보 ({data.sales_branch_info.length})
          </p>
          <div className="flex flex-col gap-2">
            {data.sales_branch_info.map((branch) => (
              <BranchItem key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
