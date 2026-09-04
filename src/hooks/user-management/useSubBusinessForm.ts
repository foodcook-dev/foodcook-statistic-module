import { useState, useCallback } from 'react';
import { useAddressSearch } from '@/hooks/user-management/useAddressSearch';
import { SubBusinessInfo } from '@/types/user-management';
import { initialSubBusinessInfo } from '@/constants/user-management/user-values';

export function useSubBusinessForm(
  initialData?: Partial<SubBusinessInfo>,
  /** 이미 등록된 명세자료가 있으면 재업로드를 요구하지 않는다. */
  hasUploadedImage = false,
) {
  const [form, setForm] = useState<SubBusinessInfo>({
    ...initialSubBusinessInfo,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SubBusinessInfo, string>>>({});

  const clearError = useCallback((field: keyof SubBusinessInfo) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const onAddressComplete = useCallback(
    ({ address }: { address: string; zip_code: string }) => {
      setForm((prev) => ({ ...prev, address }));
      clearError('address');
    },
    [clearError],
  );

  const { openAddressSearch } = useAddressSearch(onAddressComplete);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = name as keyof SubBusinessInfo;
      // 일련번호는 숫자 4자리만 입력 가능
      const nextValue = field === 'serial_number' ? value.replace(/\D/g, '').slice(0, 4) : value;
      setForm((prev) => ({ ...prev, [field]: nextValue }));
      clearError(field);
    },
    [clearError],
  );

  // 명세자료는 OCR 없이 파일만 보관 후 생성 시 함께 전송
  const onSpecFileChange = useCallback(
    (file: File | null) => {
      setForm((prev) => ({ ...prev, image: file }));
      clearError('image');
    },
    [clearError],
  );

  // 종사업장은 중복 사업자등록증인 경우에만 입력하므로, 미입력 시 생성을 건너뛴다.
  const isEmpty = useCallback(
    () =>
      !form.image &&
      !form.serial_number.trim() &&
      !form.b_nm.trim() &&
      !form.address.trim() &&
      !form.address_detail.trim(),
    [form],
  );

  const validate = useCallback(() => {
    const next: Partial<Record<keyof SubBusinessInfo, string>> = {};
    if (!form.image && !hasUploadedImage)
      next.image = '종사업장 명세자료를 업로드해주세요.';
    if (!form.address.trim()) next.address = '종사업장 주소를 입력해주세요.';
    if (!form.serial_number.trim()) next.serial_number = '종사업장 일련번호를 입력해주세요.';
    else if (!/^\d{4}$/.test(form.serial_number)) next.serial_number = '일련번호는 숫자 4자리입니다.';
    if (!form.b_nm.trim()) next.b_nm = '종사업장 상호명을 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form, hasUploadedImage]);

  return {
    form,
    errors,
    onChange,
    onSpecFileChange,
    openAddressSearch,
    isEmpty,
    validate,
  };
}
