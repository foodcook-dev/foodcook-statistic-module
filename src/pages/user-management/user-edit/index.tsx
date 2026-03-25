import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  UserInfoSection,
  UserInfoSectionRef,
} from '@/components/modules/user-management/UserInfoSection';
import {
  getUserDetail,
  postReferralCodeValidate,
  patchUserUpdate,
} from '@/libs/user-management-api';
import { useAlert } from '@/hooks/useAlert';
import { showToastMessage } from '@/libs/toast-message';

export default function UserManagementEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const setAlert = useAlert();
  const userInfoRef = useRef<UserInfoSectionRef>(null);

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userDetail', id],
    queryFn: () => getUserDetail(Number(id)),
    enabled: !!id,
  });

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

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data: FormData) => patchUserUpdate(Number(id), data),
    onSuccess: () => {
      showToastMessage({ content: '사용자 정보가 수정되었습니다.' });
      navigate(-1);
    },
    onError: (error: any) => {
      setAlert({ message: error.detail || '수정에 실패했습니다. 다시 시도해주세요.' });
    },
  });

  const handleSubmit = async () => {
    const isValid = userInfoRef.current?.validate() ?? false;
    if (!isValid) return;

    const userForm = userInfoRef.current!.getFormData();
    const formData = new FormData();

    // 추천인 코드가 입력된 경우에만 검증 수행
    if (userForm.referral_code) {
      await validateReferralCode(userForm.referral_code);
    }

    formData.append('nickname', userForm.nickname);
    formData.append('phone_num', userForm.phone_num);
    formData.append('email', userForm.email);
    formData.append('tier', String(userForm.tier || ''));
    formData.append('recommender', String(userForm.recommender || ''));
    formData.append('referral_code', userForm.referral_code || '');
    formData.append('memo', userForm.memo || '');

    updateUser(formData);
  };

  if (isLoading || !userInfo) return null;

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-4">
        <UserInfoSection
          ref={userInfoRef}
          initialData={{
            username: userInfo.username,
            nickname: userInfo.nickname,
            phone_num: userInfo.phone_num,
            email: userInfo.email ?? '',
            tier: userInfo.tier ?? 0,
            recommender: userInfo.recommender,
            referral_code: userInfo.referral_code ?? '',
            memo: userInfo.memo ?? '',
          }}
          mode="edit"
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
