import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAddressSearch } from '@/hooks/user-management/useAddressSearch';
import { SalesBranchInfo } from '@/types/user-management';
import { postCertFileUpload } from '@/libs/user-management-api';
import { initialBranchInfo } from '@/constants/user-management/user-values';
import { useAlert } from '@/hooks/useAlert';

export function useSalesBranchForm(initialData?: Partial<SalesBranchInfo>) {
  const setAlert = useAlert();
  const [branchInfoForm, setBranchInfoForm] = useState<SalesBranchInfo>({
    ...initialBranchInfo,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SalesBranchInfo, string>>>({});

  const onAddressComplete = useCallback(
    ({ address, zip_code }: { address: string; zip_code: string }) => {
      setBranchInfoForm((prev) => ({ ...prev, address, zip_code }));
      setErrors((prev) => (prev.address ? { ...prev, address: undefined } : prev));
    },
    [],
  );

  const { openAddressSearch } = useAddressSearch(onAddressComplete);

  const { mutateAsync: uploadCertImage, isPending: isUploading } = useMutation({
    mutationFn: (data: FormData) => postCertFileUpload(data),
    onSuccess: async (data) => {
      if (!data?.result) {
        throw new Error(
          '사업자등록증 인식에 실패했습니다.\n인식이 가능한 이미지를 재업로드 하거나, 수기로 작성해주세요',
        );
      }
      await setBranchInfoForm((prev) => ({
        ...prev,
        ...data.detail,
      }));
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(data.detail).forEach((key) => {
          delete next[key as keyof Partial<Record<keyof SalesBranchInfo, string>>];
        });
        return next;
      });
    },
    onError: (error: any) => {
      setBranchInfoForm((prev) => ({
        ...prev,
        owner_name: '',
        b_nm: '',
        b_no: '',
        address: '',
        address_detail: '',
        zip_code: '',
        tax_type: '',
        b_sector: '',
        b_type: '',
        start_dt: '',
      }));
      setAlert({
        message: error.message || '사업자등록증 업로드에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = name as keyof SalesBranchInfo;
      let nextValue: string | number | null = value;
      setBranchInfoForm((prev) => ({ ...prev, [field]: nextValue }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const onSelectChange = useCallback((field: keyof SalesBranchInfo, value: string) => {
    const parsed = value === '' ? null : isNaN(Number(value)) ? value : Number(value);
    setBranchInfoForm((prev) => ({ ...prev, [field]: parsed }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const onToggle = useCallback((field: keyof SalesBranchInfo, checked: boolean) => {
    setBranchInfoForm((prev) => ({ ...prev, [field]: checked }));
  }, []);

  const onDeliveryDaysChange = useCallback((val: Record<string, boolean>) => {
    setBranchInfoForm((prev) => ({ ...prev, delivery_available_days: val }));
  }, []);

  const onLicenseChange = useCallback(async (file: File | null) => {
    if (file) {
      const formData = new FormData();
      formData.append('cert_image', file);
      await uploadCertImage(formData);
      setBranchInfoForm((prev) => ({ ...prev, cert_image: file }));
    }
  }, []);

  const validate = useCallback(() => {
    const next: Partial<Record<keyof SalesBranchInfo, string>> = {};
    if (!branchInfoForm.allias.trim()) next.allias = '지점 별칭을 입력해주세요.';
    if (!branchInfoForm.owner_name.trim()) next.owner_name = '대표자명을 입력해주세요.';
    if (!branchInfoForm.b_no.trim()) next.b_no = '사업자번호를 입력해주세요.';
    if (!branchInfoForm.address.trim()) next.address = '주소를 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [branchInfoForm]);

  return {
    branchInfoForm,
    errors,
    isUploading,
    onLicenseChange,
    onChange,
    onSelectChange,
    onToggle,
    onDeliveryDaysChange,
    openAddressSearch,
    validate,
  };
}
