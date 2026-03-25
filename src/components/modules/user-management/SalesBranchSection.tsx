import { forwardRef, useImperativeHandle } from 'react';
import { LabeledInput, Label } from '@/components/modules/LabeledInput';
import { LabeledSelect } from '@/components/modules/LabeledSelect';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SectionCard } from './SectionCard';
import { DeliveryDaysPicker } from './DeliveryDaysPicker';
import { BusinessLicenseUpload } from './BusinessLicenseUpload';
import { useSalesBranchForm } from '@/hooks/user-management/useSalesBranchForm';
import { SalesBranchInfo } from '@/types/user-management';

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
        {/* 지점 유형 + 지점명 */}
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
            label="지점명"
            required
            value={branchInfoForm.allias}
            onChange={onChange}
            placeholder="지점명을 입력해주세요"
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
              value={branchInfoForm.address}
              onChange={onChange}
              placeholder="주소를 입력해주세요"
              error={errors.address}
            />
            <Button type="button" variant="outline" onClick={openAddressSearch}>
              주소 검색
            </Button>
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
          />
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { field: 'is_active', label: '활성 여부' },
                { field: 'is_confirmed', label: '승인 여부' },
                { field: 'is_default', label: '기본배송지 설정' },
              ] as const
            ).map(({ field, label }) => (
              <div
                key={field}
                className="border-border flex items-center justify-between rounded-lg border px-4 py-2.5"
              >
                <Label id={field} label={label} />
                <Switch
                  id={field}
                  checked={branchInfoForm[field]}
                  onCheckedChange={(checked) => onToggle(field, checked)}
                />
              </div>
            ))}
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
