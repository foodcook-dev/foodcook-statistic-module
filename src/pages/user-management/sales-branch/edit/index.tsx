import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  SalesBranchSection,
  SalesBranchSectionRef,
} from '@/components/modules/user-management/form/SalesBranchSection';
import { getSalesCompanyDetail, patchSalesBranchUpdate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';
import { buildFormData } from '@/libs/form-data-builder';
import { toSalesBranchFields } from '@/constants/user-management/form-data-field';

export default function SalesBranchEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { companyId, branchId } = useParams<{ companyId: string; branchId: string }>();
  const setAlert = useAlert();
  const branchRef = useRef<SalesBranchSectionRef>(null);

  const { data: salesCompanyInfo, isLoading } = useQuery({
    queryKey: ['salesCompanyDetail', Number(companyId)],
    queryFn: () => getSalesCompanyDetail(Number(companyId)),
    enabled: !!companyId,
  });

  const branchInfo = salesCompanyInfo?.sales_branch_info?.find(
    (branch) => branch.id === Number(branchId),
  );

  const { mutate: updateBranch, isPending } = useMutation({
    mutationFn: (data: FormData) => patchSalesBranchUpdate(Number(branchId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesCompanyDetail', Number(companyId)] });
      showToastMessage({ content: '지점 정보가 수정되었습니다.' });
      navigate(-1);
    },
    onError: (error: any) => {
      setAlert({ message: error.detail || '수정에 실패했습니다. 다시 시도해주세요.' });
    },
  });

  const handleSubmit = () => {
    if (!branchRef.current?.validate()) return;

    const branchInfo = branchRef.current.getFormData();
    updateBranch(buildFormData(toSalesBranchFields(branchInfo)));
  };

  if (isLoading || !salesCompanyInfo) return null;

  if (!branchInfo) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">지점 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-4">
        <SalesBranchSection
          ref={branchRef}
          certImageUrl={branchInfo.cert_image ?? undefined}
          initialData={{
            branch_type: branchInfo.type,
            allias: branchInfo.allias,
            manager: branchInfo.manager,
            b_no: branchInfo.b_no,
            owner_name: branchInfo.owner_name,
            start_dt: branchInfo.start_dt,
            b_sector: branchInfo.b_sector,
            b_type: branchInfo.b_type,
            address: branchInfo.address,
            address_detail: branchInfo.address_detail || '',
            delivery_memo: branchInfo.delivery_memo || '',
            gate_password: branchInfo.gate_password || '',
            phone_num: branchInfo.phone_num || '',
            delivery_available_days: branchInfo.delivery_available_days as Record<string, boolean>,
            is_active: branchInfo.is_active,
            is_confirmed: branchInfo.is_confirmed,
            is_default: branchInfo.is_default,
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
