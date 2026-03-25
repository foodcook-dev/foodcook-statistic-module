import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  SalesCompanySection,
  SalesCompanySectionRef,
} from '@/components/modules/user-management/SalesCompanySection';
import { getSalesCompanyDetail, patchSalesCompanyUpdate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';

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
    const isValid = salesInfoRef.current?.validate() ?? false;
    if (!isValid) return;

    const salesInfo = salesInfoRef.current!.getFormData();
    const formData = new FormData();

    const fields = {
      owner_name: salesInfo.owner_name,
      b_nm: salesInfo.b_nm,
      b_no: salesInfo.b_no,
      address: salesInfo.address + ', ' + salesInfo.address_detail,
      zip_code: salesInfo.zip_code,
      tax_type: salesInfo.tax_type,
      driver: String(salesInfo.driver || ''),
      platform: salesInfo.platform || '',
      franchise: String(salesInfo.franchise || ''),
      manager: String(salesInfo.manager || ''),
      start_dt: salesInfo.start_dt || '',
      email: salesInfo.email,
      b_sector: salesInfo.b_sector || '',
      b_type: salesInfo.b_type || '',
      note: salesInfo.note || '',
      is_meet_pay_available: String(salesInfo.is_meet_pay_available),
      is_card_pay_available: String(salesInfo.is_card_pay_available),
      is_deposit_pay_available: String(salesInfo.is_deposit_pay_available),
      is_fixed_account_pay_available: String(salesInfo.is_fixed_account_pay_available),
      is_test: String(salesInfo.is_test),
      delivery_available_days: JSON.stringify(salesInfo.delivery_available_days || {}),
      dongwon_sales_company_code: salesInfo.dongwon_sales_company_code || '',
      jette_sales_company_code: salesInfo.jette_sales_company_code || '',
      foodist_sales_company_code: salesInfo.foodist_sales_company_code || '',
    };

    if (salesInfo.cert_image instanceof File) {
      formData.append('cert_image', salesInfo.cert_image);
    }

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    updateSalesCompany(formData);
  };

  if (isLoading || !salesCompanyInfo) return null;

  // address를 주소/상세주소로 분리 (', ' 기준)
  const [address, ...addressDetailParts] = (salesCompanyInfo.address ?? '').split(', ');
  const address_detail = addressDetailParts.join(', ');

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
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
