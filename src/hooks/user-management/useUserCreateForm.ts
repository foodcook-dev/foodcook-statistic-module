import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserInfo, SalesCompanyInfo } from '@/types/user-management';
import { useAddressSearch } from '@/hooks/user-management/useAddressSearch';
import { SalesCompanyErrors } from '@/types/user-management';
import {
  postCertFileUpload,
  getFranchisePayment,
  postVerifyBankAccount,
} from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { initialUserInfo, initialSalesInfo } from '@/constants/user-management/user-values';

export function useUserInfoForm(
  initialData?: Partial<UserInfo>,
  mode: 'create' | 'edit' = 'create',
) {
  const setAlert = useAlert();
  const [userInfoForm, setUserInfoForm] = useState<UserInfo>({
    ...initialUserInfo,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});
  const [bankVerified, setBankVerified] = useState(false);

  // input 필드 변경 핸들러
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = name as keyof UserInfo;
      let nextValue: string | number | null = value;
      if (field === 'phone_num') nextValue = value.replace(/[^0-9]/g, '').slice(0, 11);
      setUserInfoForm((prev) => ({ ...prev, [field]: nextValue }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

      // 계좌번호 변경 시 검증 초기화
      if (field === 'account_number') {
        setBankVerified(false);
        setUserInfoForm((prev) => ({ ...prev, account_holder: '' }));
      }
    },
    [],
  );

  // select 필드 변경 핸들러
  const onSelectChange = useCallback((field: keyof UserInfo, value: string) => {
    setUserInfoForm((prev) => ({
      ...prev,
      [field]: value === '' ? null : field === 'bank_code' ? value : Number(value),
    }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

    // 은행 변경 시 검증 초기화
    if (field === 'bank_code') {
      setBankVerified(false);
      setUserInfoForm((prev) => ({ ...prev, account_holder: '' }));
    }
  }, []);

  // 은행 계좌 검증 API 호출
  const { mutateAsync: verifyBankAccount } = useMutation({
    mutationFn: () =>
      postVerifyBankAccount({
        bank_code: userInfoForm.bank_code ?? '',
        account_number: userInfoForm.account_number ?? '',
      }),
    onSuccess: async (response) => {
      setUserInfoForm((prev) => ({ ...prev, account_holder: response.holder_name }));
      setBankVerified(true);
      setErrors((prev) => ({ ...prev, bank_code: undefined }));
    },
    onError: (error: any) => {
      setUserInfoForm((prev) => ({ ...prev, account_holder: '' }));
      setBankVerified(false);
      setAlert({
        message: error.detail || '환불계좌 검증에 실패했습니다.\n계좌 정보를 다시 확인해주세요.',
      });
    },
  });

  // 은행 계좌 검증 핸들러
  const onBankVerify = useCallback(async () => {
    if (!userInfoForm.bank_code || !userInfoForm.account_number) return;
    await verifyBankAccount();
  }, [userInfoForm.bank_code, userInfoForm.account_number]);

  // 유효성 검사 함수
  const validate = useCallback(() => {
    const next: Partial<Record<keyof UserInfo, string>> = {};
    if (mode === 'create') {
      if (!userInfoForm.username.trim()) next.username = '아이디를 입력해주세요.';
      if (!userInfoForm.password) next.password = '비밀번호를 입력해주세요.';
    }
    if (!userInfoForm.nickname.trim()) next.nickname = '실명을 입력해주세요.';
    if (!userInfoForm.phone_num.trim()) next.phone_num = '연락처를 입력해주세요.';
    if (userInfoForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfoForm.email)) {
      next.email = '올바른 이메일 형식이 아닙니다.';
    }
    if ((userInfoForm.bank_code || userInfoForm.account_number) && !bankVerified) {
      next.bank_code = '계좌 검증을 통해\n예금주를 확인해주세요.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [userInfoForm, mode]);

  return {
    form: userInfoForm,
    errors,
    onChange,
    onSelectChange,
    onBankVerify,
    bankVerified,
    validate,
  };
}

export function useSalesCompanyInfoForm(initialData?: Partial<SalesCompanyInfo>) {
  const setAlert = useAlert();
  const [salesInfoForm, setSalesInfoForm] = useState<SalesCompanyInfo>({
    ...initialSalesInfo,
    ...initialData,
  });
  const [errors, setErrors] = useState<SalesCompanyErrors>({});

  // 주소 검색 완료 핸들러
  const onAddressComplete = useCallback(
    ({ address, zip_code }: { address: string; zip_code: string }) => {
      setSalesInfoForm((prev) => ({ ...prev, address, zip_code }));
      setErrors((prev) => (prev.address ? { ...prev, address: undefined } : prev));
    },
    [],
  );

  const { openAddressSearch } = useAddressSearch(onAddressComplete);

  // 사업자등록증 이미지 업로드 및 인식 API 호출
  const { mutateAsync: uploadCertImage, isPending: isUploading } = useMutation({
    mutationFn: (data: FormData) => postCertFileUpload(data),
    onSuccess: async (data) => {
      if (!data?.result) {
        throw new Error(
          '사업자등록증 인식에 실패했습니다.\n인식이 가능한 이미지를 재업로드 하거나, 수기로 작성해주세요',
        );
      }
      await setSalesInfoForm((prev) => ({
        ...prev,
        ...data.detail,
      }));
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(data.detail).forEach((key) => {
          delete next[key as keyof SalesCompanyErrors];
        });
        return next;
      });
    },
    onError: (error: any) => {
      setSalesInfoForm((prev) => ({
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

  // input 필드 변경 핸들러
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = name as keyof SalesCompanyInfo;
      setSalesInfoForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  // select 필드 값 파싱 함수
  const parseSelectValue = (
    field: keyof SalesCompanyInfo,
    value: string,
  ): string | number | null => {
    if (value === '') return null;
    if (field === 'tax_type') return value;
    return isNaN(Number(value)) ? value : Number(value);
  };

  // select 필드 변경 핸들러
  const onSelectChange = useCallback(async (field: keyof SalesCompanyInfo, value: string) => {
    const parsed = parseSelectValue(field, value);

    setSalesInfoForm((prev) => ({
      ...prev,
      [field]: parsed,
    }));

    setErrors((prev) => {
      const next = prev[field] ? { ...prev, [field]: undefined } : prev;
      return field === 'franchise' && next.payment_methods
        ? { ...next, payment_methods: undefined }
        : next;
    });

    // franchise 선택 시 기본 결제수단 API 호출
    if (field === 'franchise' && parsed) {
      try {
        const result = await getFranchisePayment(parsed.toString());
        setSalesInfoForm((prev) => ({
          ...prev,
          ...result.default_payment_methods,
        }));
      } catch (error) {
        console.error('프랜차이즈 결제수단 조회 실패:', error);
      }
    }
  }, []);

  // 결제수단 토글 핸들러
  const onPaymentToggle = useCallback((field: keyof SalesCompanyInfo, checked: boolean) => {
    setSalesInfoForm((prev) => ({ ...prev, [field]: checked }));
    setErrors((prev) => (prev.payment_methods ? { ...prev, payment_methods: undefined } : prev));
  }, []);

  // 사업자등록증 변경 핸들러
  const onLicenseChange = useCallback(async (file: File | null) => {
    if (file) {
      const formData = new FormData();
      formData.append('cert_image', file);
      await uploadCertImage(formData);
      setSalesInfoForm((prev) => ({ ...prev, cert_image: file }));
    }
  }, []);

  // 배송 가능 요일 변경 핸들러
  const onDeliveryDaysChange = useCallback((val: Record<string, boolean>) => {
    setSalesInfoForm((prev) => ({ ...prev, delivery_available_days: val }));
  }, []);

  // 유효성 검사 함수
  const validate = useCallback(() => {
    const next: SalesCompanyErrors = {};
    if (!salesInfoForm.address) next.address = '주소를 입력해주세요.';
    if (!salesInfoForm.owner_name.trim()) next.owner_name = '대표자명을 입력해주세요.';
    if (!salesInfoForm.b_nm.trim()) next.b_nm = '상호명을 입력해주세요.';
    if (!salesInfoForm.b_no.trim()) next.b_no = '사업자번호를 입력해주세요.';
    if (!salesInfoForm.tax_type.trim()) next.tax_type = '과세유형을 선택해주세요.';
    if (!salesInfoForm.platform.trim()) next.platform = '플랫폼을 선택해주세요.';
    if (
      !salesInfoForm.is_card_pay_available &&
      !salesInfoForm.is_deposit_pay_available &&
      !salesInfoForm.is_fixed_account_pay_available &&
      !salesInfoForm.is_meet_pay_available
    )
      next.payment_methods = '결제수단을 하나 이상 선택해주세요.';
    if (salesInfoForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(salesInfoForm.email)) {
      next.email = '올바른 이메일 형식이 아닙니다.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [salesInfoForm]);

  return {
    form: salesInfoForm,
    errors,
    onChange,
    onSelectChange,
    onPaymentToggle,
    onLicenseChange,
    onDeliveryDaysChange,
    openAddressSearch,
    validate,
    isUploading,
  };
}
