import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  SalesCompanySection,
  SalesCompanySectionRef,
} from '@/components/modules/user-management/form/SalesCompanySection';
import { getSalesCompanyDetail, patchSalesCompanyUpdate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';
import { buildFormData } from '@/libs/form-data-builder';
import { toSalesCompanyFields } from '@/constants/user-management/form-data-field';

export default function SalesCompanyEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const setAlert = useAlert();
  const salesInfoRef = useRef<SalesCompanySectionRef>(null);

  const { data: salesCompanyInfo, isLoading } = useQuery({
    queryKey: ['salesCompanyDetail', companyId],
    queryFn: () => getSalesCompanyDetail(Number(companyId)),
    enabled: !!companyId,
  });

  const { mutate: updateSalesCompany, isPending } = useMutation({
    mutationFn: (data: FormData) => patchSalesCompanyUpdate(Number(companyId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesCompanyDetail', companyId] });
      showToastMessage({ content: '판매사업자 정보가 수정되었습니다.' });
      navigate(-1);
    },
    onError: (error: any) => {
      setAlert({ message: error.detail || '수정에 실패했습니다. 다시 시도해주세요.' });
    },
  });

  const handleSubmit = () => {
    if (!salesInfoRef.current?.validate())
      return setAlert({ message: '미입력 또는 잘못입력된 정보가 있습니다.' });

    const salesInfo = salesInfoRef.current!.getFormData();
    updateSalesCompany(buildFormData(toSalesCompanyFields(salesInfo)));
  };

  if (isLoading || !salesCompanyInfo) return null;

  // address를 주소/상세주소로 분리 (', ' 기준)
  const [address, ...addressDetailParts] = (salesCompanyInfo.address ?? '').split(', ');
  const address_detail = addressDetailParts.join(', ');

  console.log('salesCompanyInfo', salesCompanyInfo);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-4">
        <SalesCompanySection
          ref={salesInfoRef}
          certImageUrl={salesCompanyInfo.cert_image ?? undefined}
          initialData={{
            owner_name: salesCompanyInfo.owner_name,
            b_nm: salesCompanyInfo.b_nm,
            b_no: salesCompanyInfo.b_no,
            address,
            address_detail,
            zip_code: salesCompanyInfo.zip_code ?? '',
            tax_type: salesCompanyInfo.tax_type,
            driver: salesCompanyInfo.driver,
            platform: salesCompanyInfo.platform,
            franchise: salesCompanyInfo.franchise,
            manager: salesCompanyInfo.manager,
            start_dt: salesCompanyInfo.start_dt,
            email: salesCompanyInfo.email,
            b_sector: salesCompanyInfo.b_sector,
            b_type: salesCompanyInfo.b_type,
            note: salesCompanyInfo.note ?? '',
            is_meet_pay_available: salesCompanyInfo.is_meet_pay_available,
            is_card_pay_available: salesCompanyInfo.is_card_pay_available,
            is_deposit_pay_available: salesCompanyInfo.is_deposit_pay_available,
            is_fixed_account_pay_available: salesCompanyInfo.is_fixed_account_pay_available,
            is_test: salesCompanyInfo.is_test,
            delivery_available_days: salesCompanyInfo.delivery_available_days as Record<
              string,
              boolean
            >,
            dongwon_sales_company_code: salesCompanyInfo.dongwon_sales_company_code ?? '',
            jette_sales_company_code: salesCompanyInfo.jette_sales_company_code ?? '',
            foodist_sales_company_code: salesCompanyInfo.foodist_sales_company_code ?? '',
          }}
        />

        <div className="flex justify-end pb-8">
          <Button onClick={handleSubmit} disabled={isPending}>
            수정
          </Button>
        </div>
      </div>
    </div>
  );
}
