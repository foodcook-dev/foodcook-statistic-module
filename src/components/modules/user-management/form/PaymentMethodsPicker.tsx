import { Checkbox } from '@/components/ui/checkbox';
import { PAYMENT_METHODS } from '@/constants/user-management/methods';
import { cn } from '@/utils/common';

export function CheckCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
      className={cn(
        'bg-background flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2 text-left text-xs transition-colors',
        checked ? 'border-primary text-primary' : 'border-border text-contrast',
      )}
    >
      <Checkbox checked={checked} />
      {label}
    </label>
  );
}

export function PaymentMethodsPicker({
  values,
  onToggle,
  error,
}: {
  values: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-4">
        <p className="text-contrast text-sm leading-none font-medium">결제수단</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PAYMENT_METHODS.map(({ key, label }) => (
          <CheckCard
            key={key}
            label={label}
            checked={values[key]}
            onChange={(checked) => onToggle(key, checked)}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
