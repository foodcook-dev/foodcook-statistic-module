import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  SalesBranchSection,
  SalesBranchSectionRef,
} from '@/components/modules/user-management/form/SalesBranchSection';
import { postSalesBranchCreate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';
import { buildFormData } from '@/libs/form-data-builder';
import { toSalesBranchFields } from '@/constants/user-management/form-data-field';

export default function SalesBranchCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const setAlert = useAlert();
  const branchRef = useRef<SalesBranchSectionRef>(null);

  const { mutate: createBranch, isPending } = useMutation({
    mutationFn: (data: FormData) => postSalesBranchCreate(Number(companyId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesCompanyDetail', Number(companyId)] });
      showToastMessage({ content: '지점이 생성되었습니다.' });
      navigate(-1);
    },
    onError: (error: any) => {
      setAlert({ message: error.detail || '생성에 실패했습니다. 다시 시도해주세요.' });
    },
  });

  const handleSubmit = () => {
    if (!branchRef.current?.validate())
      return setAlert({ message: '미입력 또는 잘못입력된 정보가 있습니다.' });

    const branchInfo = branchRef.current.getFormData();
    createBranch(buildFormData(toSalesBranchFields(branchInfo)));
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-4">
        <SalesBranchSection ref={branchRef} />
        <div className="flex justify-end pb-8">
          <Button onClick={handleSubmit} disabled={isPending}>
            생성
          </Button>
        </div>
      </div>
    </div>
  );
}
