import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  SalesBranchSection,
  SalesBranchSectionRef,
} from '@/components/modules/user-management/SalesBranchSection';
import { postSalesBranchCreate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';

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
    if (!branchRef.current?.validate()) return;

    const branchInfo = branchRef.current.getFormData();
    const formData = new FormData();

    const fields = {
      branch_type: branchInfo.branch_type,
      allias: branchInfo.allias,
      manager: String(branchInfo.manager || ''),
      b_no: branchInfo.b_no,
      owner_name: branchInfo.owner_name,
      start_dt: branchInfo.start_dt || '',
      b_sector: branchInfo.b_sector || '',
      b_type: branchInfo.b_type || '',
      zip_code: branchInfo.zip_code,
      address: branchInfo.address,
      address_detail: branchInfo.address_detail || '',
      delivery_memo: branchInfo.delivery_memo || '',
      phone_num: branchInfo.phone_num || '',
      gate_password: branchInfo.gate_password || '',
      delivery_available_days: JSON.stringify(branchInfo.delivery_available_days || {}),
      is_active: String(branchInfo.is_active),
      is_confirmed: String(branchInfo.is_confirmed),
      is_default: String(branchInfo.is_default),
    };

    if (branchInfo.cert_image instanceof File) {
      formData.append('cert_image', branchInfo.cert_image);
    }

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    createBranch(formData);
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
