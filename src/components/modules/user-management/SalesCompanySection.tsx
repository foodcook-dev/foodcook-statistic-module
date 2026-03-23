import { forwardRef, useImperativeHandle } from 'react';
import { LabeledInput, Label } from '@/components/modules/LabeledInput';
import { LabeledSelect } from '@/components/modules/LabeledSelect';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SalesCompanyInfo } from '@/types/user-management';
import { SectionCard } from './SectionCard';
import { DeliveryDaysPicker } from './DeliveryDaysPicker';
import { PaymentMethodsPicker } from './PaymentMethodsPicker';
import { BusinessLicenseUpload } from './BusinessLicenseUpload';
import { Switch } from '@/components/ui/switch';
import { useSalesCompanyInfoForm } from '@/hooks/user-management/useUserCreateForm';

export interface SalesCompanySectionRef {
  validate: () => boolean;
  getFormData: () => SalesCompanyInfo;
}

export const SalesCompanySection = forwardRef<SalesCompanySectionRef>(
  function SalesCompanySection(_, ref) {
    const {
      form,
      errors,
      onChange,
      onSelectChange,
      onPaymentToggle,
      onLicenseChange,
      onDeliveryDaysChange,
      openAddressSearch,
      validate,
      isUploading,
    } = useSalesCompanyInfoForm();

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
      <SectionCard title="사업자 정보" defaultOpen={false} hasError={hasError}>
        <BusinessLicenseUpload onChange={onLicenseChange} isLoading={isUploading} />

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <div className="flex items-end gap-2">
              <LabeledInput
                id="address"
                name="address"
                label="주소"
                required
                value={form.address}
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
              value={form.address_detail}
              onChange={onChange}
              placeholder="상세주소를 입력해주세요"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="owner_name"
            name="owner_name"
            label="대표자명"
            type="text"
            required
            value={form.owner_name}
            onChange={onChange}
            placeholder="대표자명을 입력해주세요"
            error={errors.owner_name}
          />
          <LabeledInput
            id="b_nm"
            name="b_nm"
            label="상호명"
            type="text"
            required
            value={form.b_nm}
            onChange={onChange}
            placeholder="상호명을 입력해주세요"
            error={errors.b_nm}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="b_no"
            name="b_no"
            label="사업자번호"
            type="text"
            required
            value={form.b_no}
            onChange={onChange}
            placeholder="000-00-00000"
            error={errors.b_no}
          />
          <LabeledSelect
            id="tax_type"
            label="과세유형"
            placeholder="과세유형을 선택해주세요"
            required
            value={form.tax_type ?? ''}
            onChange={(value) => onSelectChange('tax_type', value)}
            optionType="tax_type"
            enableNone
            error={errors.tax_type}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LabeledInput
            id="b_sector"
            name="b_sector"
            label="업태"
            type="text"
            value={form.b_sector}
            onChange={onChange}
            placeholder="업태를 입력해주세요"
          />
          <LabeledInput
            id="b_type"
            name="b_type"
            label="업종"
            type="text"
            value={form.b_type}
            onChange={onChange}
            placeholder="업종을 입력해주세요"
          />
        </div>

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
          <LabeledInput
            id="start_dt"
            name="start_dt"
            label="개업일자"
            type="date"
            value={form.start_dt}
            onChange={onChange}
          />
        </div>

        <hr className="border-border my-1" />

        <div className="grid grid-cols-2 gap-3">
          <LabeledSelect
            id="platform"
            label="플랫폼"
            placeholder="플랫폼을 선택해주세요"
            required
            value={form.platform ?? ''}
            onChange={(value) => onSelectChange('platform', value)}
            optionType="platform"
            enableNone
            error={errors.platform}
          />
          <LabeledSelect
            id="driver"
            label="배송기사"
            placeholder="배송기사를 선택해주세요"
            value={form.driver ?? ''}
            onChange={(value) => onSelectChange('driver', value)}
            optionType="driver"
            enableNone
            searchable
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LabeledSelect
            id="franchise"
            label="프랜차이즈"
            placeholder="프랜차이즈를 선택해주세요"
            value={form.franchise ?? ''}
            onChange={(value) => onSelectChange('franchise', value)}
            optionType="franchise"
            enableNone
            searchable
          />
          <LabeledSelect
            id="manager"
            label="담당자"
            placeholder="담당자를 선택해주세요"
            value={form.manager ?? ''}
            onChange={(value) => onSelectChange('manager', value)}
            optionType="manager"
            enableNone
            searchable
          />
        </div>

        <hr className="border-border my-1" />

        <div className="grid grid-cols-2 gap-2">
          <DeliveryDaysPicker
            value={form.delivery_available_days as Record<string, boolean>}
            onChange={onDeliveryDaysChange}
          />
          <PaymentMethodsPicker
            values={{
              is_meet_pay_available: form.is_meet_pay_available,
              is_card_pay_available: form.is_card_pay_available,
              is_deposit_pay_available: form.is_deposit_pay_available,
              is_fixed_account_pay_available: form.is_fixed_account_pay_available,
            }}
            onToggle={(key, checked) => onPaymentToggle(key as keyof SalesCompanyInfo, checked)}
            disabled={!!form.franchise}
            error={errors.payment_methods}
          />
        </div>

        <hr className="border-border my-1" />

        <div className="grid grid-cols-3 gap-3">
          <LabeledInput
            id="dongwon_sales_company_code"
            name="dongwon_sales_company_code"
            label="동원 사업장 코드"
            type="text"
            value={form.dongwon_sales_company_code}
            onChange={onChange}
            placeholder="동원 사업장 코드를 입력해주세요"
          />
          <LabeledInput
            id="jette_sales_company_code"
            name="jette_sales_company_code"
            label="제때 사업장 코드"
            type="text"
            value={form.jette_sales_company_code}
            onChange={onChange}
            placeholder="제때 사업장 코드를 입력해주세요"
          />
          <LabeledInput
            id="foodist_sales_company_code"
            name="foodist_sales_company_code"
            label="푸디스트 사업장 코드"
            type="text"
            value={form.foodist_sales_company_code}
            onChange={onChange}
            placeholder="푸디스트 사업장 코드를 입력해주세요"
          />
        </div>

        <hr className="border-border my-1" />

        <div>
          <Label id="note" label="비고" />
          <Textarea
            id="note"
            name="note"
            value={form.note}
            onChange={onChange}
            placeholder="비고를 입력하세요."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Label id="is_test" label="테스트 계정" />
          <Switch
            id="is_test"
            checked={form.is_test}
            onCheckedChange={(checked) => onPaymentToggle('is_test', checked)}
          />
        </div>
      </SectionCard>
    );
  },
);
