import { Checkbox } from '@/components/ui/checkbox';
import { PAYMENT_METHODS } from '@/constants/user-management/methods';
import { cn } from '@/utils/common';

export function CheckCard({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onChange(!checked);
      }}
      className={cn(
        'bg-background flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2 text-left text-xs transition-colors',
        checked ? 'border-primary text-primary' : 'border-border text-contrast',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Checkbox checked={checked} disabled={disabled} />
      {label}
    </label>
  );
}

export function PaymentMethodsPicker({
  values,
  onToggle,
  disabled = false,
  error,
}: {
  values: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-2">
        <p className="text-contrast text-sm leading-none font-medium">결제수단</p>
        {disabled && (
          <p className="text-contrast/70 text-xs">결제수단은 프랜차이즈 설정을 따릅니다.</p>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PAYMENT_METHODS.map(({ key, label }) => (
          <CheckCard
            key={key}
            label={label}
            checked={values[key]}
            onChange={(checked) => onToggle(key, checked)}
            disabled={disabled}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
