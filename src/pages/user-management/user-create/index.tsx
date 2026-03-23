import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  UserInfoSection,
  UserInfoSectionRef,
} from '@/components/modules/user-management/UserInfoSection';
import {
  SalesCompanySection,
  SalesCompanySectionRef,
} from '@/components/modules/user-management/SalesCompanySection';
import { postReferralCodeValidate, postUserCreate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';

export default function UserManagementCreate() {
  const navigate = useNavigate();
  const setAlert = useAlert();
  const userInfoRef = useRef<UserInfoSectionRef>(null);
  const salesInfoRef = useRef<SalesCompanySectionRef>(null);

  const { mutateAsync: validateReferralCode } = useMutation({
    mutationFn: (code: string) => postReferralCodeValidate(code),
    onSuccess: (data) => {
      if (data.detail === '유효하지 않은 추천인 코드입니다.') {
        throw new Error(data.detail);
      }
    },
    onError: (error: any) => {
      setAlert({
        message:
          error.message || error.detail || '추천인 코드 검증에 실패했습니다. 다시 시도해주세요.',
      });
      return;
    },
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: postUserCreate,
    onSuccess: () => {
      showToastMessage({ content: '사용자 생성이 완료되었습니다.' });
      navigate(-1);
    },
    onError: (error: any) => {
      setAlert({
        message: error.detail || '사용자 생성에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const handleSubmit = async () => {
    const isUserValid = userInfoRef.current?.validate() ?? false;
    const isSalesValid = salesInfoRef.current?.validate() ?? false;
    if (!isUserValid || !isSalesValid) return;

    const userInfo = userInfoRef.current!.getFormData();
    const salesInfo = salesInfoRef.current!.getFormData();

    // 추천인 코드가 입력된 경우에만 검증 수행
    if (userInfo.referral_code) {
      await validateReferralCode(userInfo.referral_code);
    }

    const formData = new FormData();

    formData.append('username', userInfo.username);
    formData.append('password', userInfo.password);
    formData.append('nickname', userInfo.nickname);
    formData.append('phone_num', userInfo.phone_num);
    formData.append('email', userInfo.email);
    formData.append('recommender', String(userInfo.recommender || ''));
    formData.append('tier', String(userInfo.tier || ''));
    formData.append('referral_code', userInfo.referral_code || '');
    formData.append('memo', userInfo.memo || '');

    const salesCompanyFields = {
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
      start_dt: salesInfo.start_dt,
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
      formData.append('sales_company_info.cert_image', salesInfo.cert_image);
    }

    Object.entries(salesCompanyFields).forEach(([key, value]) => {
      formData.append(`sales_company_info.${key}`, value);
    });

    // FormData 확인
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    createUser(formData);
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-4">
        <UserInfoSection ref={userInfoRef} />
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
