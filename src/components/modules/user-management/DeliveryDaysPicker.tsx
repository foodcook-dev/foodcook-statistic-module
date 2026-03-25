import { DAYS } from '@/constants/user-management/day';

import { cn } from '@/utils/common';

interface DeliveryDaysPickerProps {
  value: Record<string, boolean>;
  onChange: (val: Record<string, boolean>) => void;
}

export function DeliveryDaysPicker({ value, onChange }: DeliveryDaysPickerProps) {
  const selected = new Set(
    Object.entries(value)
      .filter(([, isSelected]) => isSelected)
      .map(([day]) => day),
  );
  const isAll = selected.size === 0;

  const onToggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);

    // 모든 요일에 대해 true/false 값 설정
    const allDays = Object.fromEntries(DAYS.map(({ id: dayId }) => [dayId, next.has(dayId)]));

    onChange(allDays);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-2">
        <p className="text-contrast text-sm leading-none font-medium">배송 가능 요일</p>

        <p className="text-contrast/60 text-[12px] leading-none font-medium">
          모든 요일 배송은 &apos;전체&apos;를 선택하세요.
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange({})}
          className={cn(
            'bg-background h-9 rounded-lg border px-3 py-1 text-sm transition-colors',
            isAll ? 'border-primary text-primary' : 'border-border text-contrast',
          )}
        >
          전체
        </button>
        {DAYS.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={cn(
              'bg-background h-9 rounded-lg border px-3 py-1 text-sm transition-colors',
              selected.has(id) ? 'text-primary border-primary' : 'border-border text-contrast',
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
