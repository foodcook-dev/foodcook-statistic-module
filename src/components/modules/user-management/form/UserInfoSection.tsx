import { forwardRef, useImperativeHandle } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LabeledInput } from '@/components/modules/LabeledInput';
import { LabeledSelect } from '@/components/modules/LabeledSelect';
import { LabeledTextarea } from '@/components/modules/LabeledTextArea';
import { UserInfo } from '@/types/user-management';
import { SectionCard } from './SectionCard';
import { useUserInfoForm } from '@/hooks/user-management/useUserCreateForm';
import { getBankList } from '@/libs/user-management-api';
import { Button } from '@/components/ui/button';

export interface UserInfoSectionRef {
  validate: () => boolean;
  getFormData: () => UserInfo;
}

interface UserInfoSectionProps {
  initialData?: Partial<UserInfo>;
  mode?: 'create' | 'edit';
}

export const UserInfoSection = forwardRef<UserInfoSectionRef, UserInfoSectionProps>(
  function UserInfoSection({ initialData, mode = 'create' }, ref) {
    const { form, errors, onChange, onSelectChange, onBankVerify, bankVerified, validate } =
      useUserInfoForm(initialData, mode);

    const { data: bankOptions = [] } = useQuery({
      queryKey: ['bankList'],
      queryFn: getBankList,
    });

    useImperativeHandle(
      ref,
      () => ({
        validate,
        getFormData: () => form,
      }),
      [validate, form],
    );

    const hasError = Object.values(errors).some((v) => !!v);
    const canVerify = !!form.bank_code && !!form.account_number && !bankVerified;

    return (
      <SectionCard title="사용자 정보" hasError={hasError}>
        {mode === 'create' && (
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
        )}

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
            name="tier"
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
            name="recommender"
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

        <LabeledTextarea
          id="memo"
          name="memo"
          label="메모"
          value={form.memo}
          onChange={onChange}
          placeholder="관리자 메모를 입력하세요."
        />

        <hr className="border-border my-1" />

        <p className="flex items-end gap-4 text-sm font-semibold">
          환불계좌 정보
          {errors.bank_code && (
            <span className="text-xs font-medium text-red-500">{errors.bank_code}</span>
          )}
        </p>

        <div className="grid grid-cols-3 items-end gap-3">
          <LabeledSelect
            id="bank_code"
            name="bank_code"
            label="은행"
            placeholder="은행을 선택해주세요"
            value={form.bank_code ?? ''}
            onChange={(value) => onSelectChange('bank_code', value)}
            options={bankOptions}
            enableNone
            searchable
          />

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <LabeledInput
                id="account_number"
                name="account_number"
                label="계좌번호"
                type="text"
                value={form.account_number ?? ''}
                onChange={onChange}
                placeholder="계좌번호를 입력해주세요"
              />
            </div>
            <Button onClick={onBankVerify} disabled={!canVerify}>
              {bankVerified ? '예금주 확인됨' : '예금주 조회'}
            </Button>
          </div>

          <LabeledInput
            id="account_holder"
            name="account_holder"
            label="예금주명"
            type="text"
            value={form.account_holder ?? ''}
            readOnly
            placeholder="조회시 자동입력"
          />
        </div>
      </SectionCard>
    );
  },
);
