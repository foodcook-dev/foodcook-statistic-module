import { forwardRef, useImperativeHandle } from 'react';
import { LabeledInput, Label } from '@/components/modules/LabeledInput';
import { LabeledSelect } from '@/components/modules/LabeledSelect';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SectionCard } from './SectionCard';
import { DeliveryDaysPicker } from './DeliveryDaysPicker';
import { BusinessLicenseUpload } from './BusinessLicenseUpload';
import { useSalesBranchForm } from '@/hooks/user-management/useSalesBranchForm';
import { SalesBranchInfo } from '@/types/user-management';
import { BRANCH_TOGGLE_FIELDS } from '@/constants/user-management/methods';

export interface SalesBranchSectionRef {
  validate: () => boolean;
  getFormData: () => SalesBranchInfo;
}

interface SalesBranchSectionProps {
  initialData?: Partial<SalesBranchInfo>;
  certImageUrl?: string;
}

export const SalesBranchSection = forwardRef<SalesBranchSectionRef, SalesBranchSectionProps>(
  function SalesBranchSection({ initialData, certImageUrl }, ref) {
    const {
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
    } = useSalesBranchForm(initialData);

    useImperativeHandle(
      ref,
      () => ({
        validate,
        getFormData: () => branchInfoForm,
      }),
      [validate, branchInfoForm],
    );

    const hasError = Object.values(errors).some((v) => !!v);

    return (
      <SectionCard title="지점 정보" hasError={hasError}>
        <BusinessLicenseUpload
          onChange={onLicenseChange}
          isLoading={isUploading}
          initialUrl={certImageUrl}
        />
        {/* 지점 유형 + 지점별칭 */}
        <div className="grid grid-cols-2 gap-3">
          <LabeledSelect
            id="branch_type"
            label="지점 유형"
            placeholder="지점 유형을 선택해주세요"
            required
            value={branchInfoForm.branch_type}
            onChange={(value) => onSelectChange('branch_type', value)}
            optionType="branch_type"
            enableNone
            error={errors.branch_type}
          />
          <LabeledInput
            id="allias"
            name="allias"
            label="지점 별칭"
            required
            value={branchInfoForm.allias}
            onChange={onChange}
            placeholder="지점 별칭을 입력해주세요"
            error={errors.allias}
          />
        </div>

        {/* 주소 */}
        <div className="col-span-2">
          <div className="flex items-end gap-2">
            <LabeledInput
              id="address"
              name="address"
              label="주소"
              required
              readOnly
              value={branchInfoForm.address}
              onChange={onChange}
              placeholder="주소를 입력해주세요"
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
            value={branchInfoForm.address_detail}
            onChange={onChange}
            placeholder="상세주소를 입력해주세요"
          />
        </div>

        {/* 대표자명 + 사업자번호 */}
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="owner_name"
            name="owner_name"
            label="대표자명"
            required
            value={branchInfoForm.owner_name}
            onChange={onChange}
            placeholder="대표자명을 입력해주세요"
            error={errors.owner_name}
          />
          <LabeledInput
            id="b_no"
            name="b_no"
            label="사업자번호"
            required
            value={branchInfoForm.b_no}
            onChange={onChange}
            placeholder="000-00-00000"
            error={errors.b_no}
          />
        </div>

        {/* 업태 + 업종 */}
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="b_sector"
            name="b_sector"
            label="업태"
            value={branchInfoForm.b_sector}
            onChange={onChange}
            placeholder="업태를 입력해주세요"
          />
          <LabeledInput
            id="b_type"
            name="b_type"
            label="업종"
            value={branchInfoForm.b_type}
            onChange={onChange}
            placeholder="업종을 입력해주세요"
          />
        </div>

        {/* 개업일 + 전화번호 */}
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="start_dt"
            name="start_dt"
            label="개업일자"
            type="date"
            value={branchInfoForm.start_dt}
            onChange={onChange}
          />
          <LabeledInput
            id="phone_num"
            name="phone_num"
            label="연락처"
            value={branchInfoForm.phone_num}
            onChange={onChange}
            placeholder="연락처를 입력해주세요"
            error={errors.phone_num}
          />
        </div>

        {/* 담당자 */}
        <div className="grid grid-cols-2 gap-3">
          <LabeledSelect
            id="manager"
            label="담당자"
            placeholder="담당자를 선택해주세요"
            value={branchInfoForm.manager != null ? String(branchInfoForm.manager) : ''}
            onChange={(value) => onSelectChange('manager', value)}
            optionType="manager"
            enableNone
            searchable
          />
        </div>

        <hr className="border-border my-1" />

        <div className="grid grid-cols-2 gap-3">
          {/* 배송 가능 요일 */}
          <DeliveryDaysPicker
            value={branchInfoForm.delivery_available_days ?? {}}
            onChange={onDeliveryDaysChange}
            type="branch"
          />
          <div className="grid grid-cols-3 gap-3">
            {BRANCH_TOGGLE_FIELDS.map(({ field, label, onText, offText }) => {
              const isOn = branchInfoForm[field];
              return (
                <button
                  key={field}
                  type="button"
                  onClick={() => onToggle(field, !isOn)}
                  className={`bg-background flex items-center justify-between rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                    isOn ? 'border-primary/50' : 'border-border hover:bg-secondary'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-contrast text-[11px] font-medium`}>{label}</span>
                    <span
                      className={`text-[13px] font-medium ${isOn ? 'text-primary' : 'text-contrast/50'}`}
                    >
                      {isOn ? onText : offText}
                    </span>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium ${
                      isOn
                        ? 'bg-primary/30 text-primary'
                        : 'bg-secondary text-contrast/40 border-border border'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isOn ? 'bg-primary' : 'bg-contrast/30'}`}
                    />
                    {isOn ? 'ON' : 'OFF'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 배송 메모 */}
        <div>
          <Label id="delivery_memo" label="배송 메모" />
          <Textarea
            id="delivery_memo"
            name="delivery_memo"
            value={branchInfoForm.delivery_memo}
            onChange={onChange}
            placeholder="배송 메모를 입력하세요."
          />
        </div>

        <LabeledInput
          id="gate_password"
          name="gate_password"
          label="출입문 비밀번호"
          value={branchInfoForm.gate_password}
          onChange={onChange}
          placeholder="출입문 비밀번호를 입력해주세요"
        />
      </SectionCard>
    );
  },
);
