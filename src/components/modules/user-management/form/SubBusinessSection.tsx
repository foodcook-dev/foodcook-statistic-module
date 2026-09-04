import { forwardRef, useImperativeHandle, useState } from 'react';
import { LabeledInput } from '@/components/modules/LabeledInput';
import { Button } from '@/components/ui/button';
import { SubBusinessInfo } from '@/types/user-management';
import { SectionCard } from './SectionCard';
import { BusinessLicenseUpload } from './BusinessLicenseUpload';
import { useSubBusinessForm } from '@/hooks/user-management/useSubBusinessForm';

export interface SubBusinessSectionRef {
  validate: () => boolean;
  getFormData: () => SubBusinessInfo;
  isEmpty: () => boolean;
  /** 종사업장 여부 스위치 상태 */
  isEnabled: () => boolean;
}

interface SubBusinessSectionProps {
  initialData?: Partial<SubBusinessInfo>;
  specImageUrl?: string;
}

export const SubBusinessSection = forwardRef<SubBusinessSectionRef, SubBusinessSectionProps>(
  function SubBusinessSection({ initialData, specImageUrl }, ref) {
    // 종사업장 여부 체크 시에만 입력이 활성화된다.
    const [enabled, setEnabled] = useState(!!initialData);
    const { form, errors, onChange, onSpecFileChange, openAddressSearch, isEmpty, validate } =
      useSubBusinessForm(initialData, !!specImageUrl);

    useImperativeHandle(
      ref,
      () => ({
        // 미체크 시 검증을 건너뛰고 생성 대상에서도 제외한다.
        validate: () => !enabled || validate(),
        getFormData: () => form,
        isEmpty: () => !enabled || isEmpty(),
        isEnabled: () => enabled,
      }),
      [enabled, validate, form, isEmpty],
    );

    const hasError = enabled && Object.values(errors).some((v) => !!v);

    return (
      <SectionCard
        title="종사업장 정보"
        hasError={hasError}
        enabled={enabled}
        onEnabledChange={setEnabled}
        enabledLabel="종사업장 여부"
      >
        <BusinessLicenseUpload
          label="종사업장 명세자료"
          description="종사업장 명세자료를 업로드해주세요."
          loadingText="업로드 중..."
          onChange={onSpecFileChange}
          error={errors.image}
          initialUrl={specImageUrl}
        />

        {/* 주소 */}
        <div className="col-span-2">
          <div className="flex items-end gap-2">
            <LabeledInput
              id="address"
              name="address"
              label="종사업장 주소"
              required
              readOnly
              value={form.address}
              onChange={onChange}
              placeholder="주소를 검색해주세요"
              error={errors.address}
            />
            <div className={errors.address ? 'mb-[22px]' : ''}>
              <Button type="button" variant="outline" onClick={openAddressSearch}>
                주소 검색
              </Button>
            </div>
          </div>
          <LabeledInput
            id="address_detail"
            name="address_detail"
            label=""
            value={form.address_detail}
            onChange={onChange}
            placeholder="상세주소를 입력해주세요"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="serial_number"
            name="serial_number"
            label="종사업장 일련번호"
            type="text"
            inputMode="numeric"
            maxLength={4}
            required
            value={form.serial_number}
            onChange={onChange}
            placeholder="0000"
            error={errors.serial_number}
          />
          <LabeledInput
            id="b_nm"
            name="b_nm"
            label="종사업장 상호명"
            type="text"
            required
            value={form.b_nm}
            onChange={onChange}
            placeholder="종사업장 상호명을 입력해주세요"
            error={errors.b_nm}
          />
        </div>
      </SectionCard>
    );
  },
);
