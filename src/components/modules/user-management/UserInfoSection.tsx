import { forwardRef, useImperativeHandle } from 'react';
import { LabeledInput, Label } from '@/components/modules/LabeledInput';
import { LabeledSelect } from '@/components/modules/LabeledSelect';
import { Textarea } from '@/components/ui/textarea';
import { UserInfoForm } from '@/types/user-management';
import { SectionCard } from './SectionCard';
import { useUserInfoForm } from '@/hooks/user-management/useUserCreateForm';

export interface UserInfoSectionRef {
  validate: () => boolean;
  getFormData: () => UserInfoForm;
}

export const UserInfoSection = forwardRef<UserInfoSectionRef>(function UserInfoSection(_, ref) {
  const { form, errors, onChange, onSelectChange, validate } = useUserInfoForm();

  useImperativeHandle(
    ref,
    () => ({
      validate,
      getFormData: () => form,
    }),
    [validate, form],
  );

  const hasError = Object.values(errors).some((v) => !!v);

  return (
    <SectionCard title="사용자 정보" hasError={hasError}>
      <div className="grid grid-cols-2 gap-3">
        <LabeledInput
          id="username"
          name="username"
          label="아이디"
          type="text"
          required
          value={form.username}
          onChange={onChange}
          placeholder="아이디를 입력해주세요"
          error={errors.username}
        />
        <LabeledInput
          id="password"
          name="password"
          label="비밀번호"
          type="text"
          required
          value={form.password}
          onChange={onChange}
          placeholder="비밀번호를 입력해주세요"
          error={errors.password}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LabeledInput
          id="nickname"
          name="nickname"
          label="실명"
          type="text"
          required
          value={form.nickname}
          onChange={onChange}
          placeholder="실명을 입력해주세요"
          error={errors.nickname}
        />
        <LabeledInput
          id="phone_num"
          name="phone_num"
          type="tel"
          label="연락처"
          required
          value={form.phone_num}
          onChange={onChange}
          placeholder="숫자만 입력 (예: 01012345678)"
          error={errors.phone_num}
        />
      </div>

      <hr className="border-border my-1" />

      <div className="grid grid-cols-2 gap-3">
        <LabeledInput
          id="email"
          name="email"
          type="email"
          label="이메일"
          value={form.email}
          onChange={onChange}
          placeholder="user@example.com"
          error={errors.email}
        />
        <LabeledSelect
          id="tier"
          label="등급"
          placeholder="등급을 선택해주세요"
          value={form.tier}
          onChange={(value) => onSelectChange('tier', value)}
          optionType="tier"
          enableNone
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LabeledSelect
          id="recommender"
          label="추천인"
          placeholder="추천인을 선택해주세요"
          value={form.recommender ?? ''}
          onChange={(value) => onSelectChange('recommender', value)}
          optionType="recommender"
          enableNone
          searchable
        />
        <LabeledInput
          id="referral_code"
          name="referral_code"
          type="text"
          label="추천인 코드"
          value={form.referral_code}
          onChange={onChange}
          placeholder="추천인 코드 입력"
        />
      </div>

      <div>
        <Label id="memo" label="메모" />
        <Textarea
          id="memo"
          name="memo"
          value={form.memo}
          onChange={onChange}
          placeholder="관리자 메모를 입력하세요."
        />
      </div>
    </SectionCard>
  );
});
