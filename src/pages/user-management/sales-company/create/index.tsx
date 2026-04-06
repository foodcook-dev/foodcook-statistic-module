import { useRef } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  SalesCompanySection,
  SalesCompanySectionRef,
} from '@/components/modules/user-management/form/SalesCompanySection';
import { showToastMessage } from '@/libs/toast-message';
import { postSalesCompanyCreate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { buildFormData } from '@/libs/form-data-builder';
import { toSalesCompanyFields } from '@/constants/user-management/form-data-field';

export default function SalesCompanyCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAlert = useAlert();
  const { id } = useParams<{ id: string }>();
  const salesInfoRef = useRef<SalesCompanySectionRef>(null);

  const { mutate: createSalesCompany, isPending } = useMutation({
    mutationFn: (data: FormData) => postSalesCompanyCreate(Number(id), data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['salesCompanyDetail'] });
      showToastMessage({ content: '판매사업자 생성이 완료되었습니다.' });
      navigate('/user-management', { replace: true });
      navigate(`/user-management/${id}`, { state: { companyId: data.id } });
    },
    onError: (error: any) => {
      setAlert({
        message: error.detail || '판매사업자 생성에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const handleSubmit = async () => {
    const isSalesValid = salesInfoRef.current?.validate() ?? false;

    if (!isSalesValid) return setAlert({ message: '미입력 또는 잘못입력된 정보가 있습니다.' });

    const salesInfo = salesInfoRef.current!.getFormData();

    createSalesCompany(buildFormData(toSalesCompanyFields(salesInfo)));
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-4">
        <SalesCompanySection ref={salesInfoRef} />

        <div className="flex justify-end pb-8">
          <Button onClick={handleSubmit} disabled={isPending}>
            생성
          </Button>
        </div>
      </div>
    </div>
  );
}
