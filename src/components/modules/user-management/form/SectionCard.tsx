import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/common';

interface SectionCardProps {
  title: string;
  defaultOpen?: boolean;
  hasError?: boolean;
  children: React.ReactNode;
  /** 값이 주어지면 제목 옆에 스위치가 노출되고, 켜진 경우에만 내용이 활성화된다. */
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  enabledLabel?: string;
}

export function SectionCard({
  title,
  children,
  defaultOpen = true,
  hasError,
  enabled,
  onEnabledChange,
  enabledLabel,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasToggle = enabled !== undefined;
  // 스위치가 있는 섹션은 켜진 경우에만 펼쳐진다.
  const isExpanded = isOpen && (!hasToggle || enabled);

  return (
    <div className="border-border bg-foreground flex w-full flex-col rounded-md border px-6 py-4">
      <div className="flex w-full items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={hasToggle && !enabled}
          className="shrink-0 text-left disabled:cursor-not-allowed"
        >
          <p
            className={`text-lg font-bold transition-colors ${
              hasToggle && !enabled ? 'text-contrast/40' : 'text-contrast'
            }`}
          >
            {title}
          </p>
        </button>

        {hasToggle && (
          <label
            className={cn(
              'bg-background flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 ring-1 transition-all duration-200 select-none',
              enabled ? 'ring-primary/40' : 'ring-border hover:bg-secondary',
            )}
          >
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => onEnabledChange?.(checked)}
              className="h-4 w-7 [&_[data-slot=switch-thumb]]:size-3.5"
            />
            {enabledLabel && (
              <span
                className={cn(
                  'text-[11px] font-semibold tracking-tight transition-colors',
                  enabled ? 'text-primary' : 'text-contrast/45',
                )}
              >
                {enabledLabel}
              </span>
            )}
          </label>
        )}

        {hasError && (
          <span className="text-xs font-medium text-red-500">일부 항목에 오류가 있습니다.</span>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={hasToggle && !enabled}
          className={`ml-auto shrink-0 transition-transform duration-300 disabled:cursor-not-allowed ${
            isExpanded ? 'rotate-0' : 'rotate-180'
          }`}
        >
          <ChevronUp className="text-muted-foreground h-5 w-5" />
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 flex flex-col gap-4">
            <hr className="border-border" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
