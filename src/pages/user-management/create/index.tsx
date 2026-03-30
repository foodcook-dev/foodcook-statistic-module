import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  UserInfoSection,
  UserInfoSectionRef,
} from '@/components/modules/user-management/form/UserInfoSection';
import {
  SalesCompanySection,
  SalesCompanySectionRef,
} from '@/components/modules/user-management/form/SalesCompanySection';
import { showToastMessage } from '@/libs/toast-message';
import { postReferralCodeValidate, postUserCreate } from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { buildFormData } from '@/libs/form-data-builder';
import { toSalesCompanyFields, toUserFields } from '@/constants/user-management/form-data-field';

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

    if (!isUserValid || !isSalesValid)
      return setAlert({ message: '미입력 또는 잘못입력된 정보가 있습니다.' });

    const userInfo = userInfoRef.current!.getFormData();
    const salesInfo = salesInfoRef.current!.getFormData();

    // 추천인 코드가 입력된 경우에만 검증 수행
    if (userInfo.referral_code) await validateReferralCode(userInfo.referral_code);

    createUser(
      buildFormData(toUserFields(userInfo), toSalesCompanyFields(salesInfo, 'sales_company_info')),
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
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
