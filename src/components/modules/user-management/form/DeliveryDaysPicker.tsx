import { DAYS } from '@/constants/user-management/day';
import { useAlert } from '@/hooks/useAlert';

import { cn } from '@/utils/common';

interface DeliveryDaysPickerProps {
  value: Record<string, boolean>;
  onChange: (val: Record<string, boolean>) => void;
  type?: 'company' | 'branch';
}

export function DeliveryDaysPicker({ value, onChange, type = 'company' }: DeliveryDaysPickerProps) {
  const setAlert = useAlert();
  const isCompany = type === 'company';
  const selected = new Set(
    Object.entries(value)
      .filter(([, isSelected]) => isSelected)
      .map(([day]) => day),
  );
  const isDefault = selected.size === 0;

  const onToggle = (id: string) => {
    setAlert({ message: '지점별 배송요일 수정은 현재 지원하지않습니다.' });
    // const next = new Set(selected);
    // next.has(id) ? next.delete(id) : next.add(id);

    // // 모든 요일에 대해 true/false 값 설정
    // const allDays = Object.fromEntries(DAYS.map(({ id: dayId }) => [dayId, next.has(dayId)]));

    // onChange(allDays);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-4">
        <p className="text-contrast text-sm leading-none font-medium">배송 가능 요일</p>
        <p className="text-contrast/70 text-[12px] leading-none font-medium">
          {isCompany
            ? '모든 요일 배송은 [전체]를 선택하세요.'
            : isDefault
              ? '판매사업자와 동일하게 설정됩니다.'
              : ''}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange({})}
          className={cn(
            'bg-background h-9 rounded-lg border px-3 py-1 text-sm transition-colors',
            isDefault ? 'border-primary text-primary' : 'border-border text-contrast',
          )}
        >
          {isCompany ? '전체' : '판매사업자 기준'}
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
