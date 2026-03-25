import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getOptions } from '@/libs/user-management-api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/utils/common';

const ITEM_HEIGHT = 36;
const MAX_VISIBLE = 8; // 최대 보여줄 개수

type Option = {
  id: number | string;
  name: string;
};

type LabeledSelectProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  optionType?: string;
  enableNone?: boolean;
  searchable?: boolean;
};

export function LabeledSelect(props: LabeledSelectProps) {
  const {
    label,
    required,
    error,
    helperText,
    className = '',
    id,
    value,
    onChange,
    placeholder = '선택해주세요',
    optionType,
    enableNone = false,
    searchable = false,
  } = props;

  const [allOptions, setAllOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        virtualizer.measure();
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!optionType) return;
    setIsLoading(true);
    getOptions({ type: optionType })
      .then((res) => setAllOptions(res.results ?? res))
      .catch((err) => console.error('옵션 로드 실패:', err))
      .finally(() => setIsLoading(false));
  }, [optionType]);

  const filteredOptions = useMemo(() => {
    if (!search) return allOptions;
    return allOptions.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  }, [allOptions, search]);

  const selectedOption = useMemo(
    () => allOptions.find((o) => String(o.id) === String(value)) ?? null,
    [allOptions, value],
  );

  const listHeight = Math.min(filteredOptions.length * ITEM_HEIGHT, MAX_VISIBLE * ITEM_HEIGHT);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 36,
    overscan: 5,
    enabled: isOpen, // 열렸을 때만 활성화
  });

  const triggerLabel = isLoading ? '로딩 중' : (selectedOption?.name ?? placeholder);

  return (
    <Field label={label} required={required} error={error} helperText={helperText}>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearch('');
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            aria-expanded={isOpen}
            disabled={isLoading}
            className={cn(
              'bg-background h-9 w-full justify-between font-normal',
              error && 'border-red-500/60',
              className,
            )}
          >
            <span
              className={`truncate ${selectedOption?.name ? 'text-contrast' : 'text-contrast/40'}`}
            >
              {triggerLabel}
            </span>
            {isLoading ? (
              <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            {searchable && (
              <div className="border-border border-b px-3 py-2">
                <input
                  className="placeholder:text-contrast/40 w-full bg-transparent text-sm outline-none"
                  placeholder="검색어를 입력해주세요"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    virtualizer.scrollToIndex(0);
                  }}
                />
              </div>
            )}

            {enableNone && (
              <div
                className="hover:bg-accent flex cursor-pointer items-center px-3 py-2 text-sm"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', !selectedOption ? 'opacity-100' : 'opacity-0')}
                />
                선택 안 함
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="text-contrast/40 py-6 text-center text-sm">검색 결과가 없습니다</div>
            ) : (
              <div ref={listRef} style={{ height: `${listHeight}px`, overflow: 'auto' }}>
                <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const o = filteredOptions[virtualItem.index];
                    const isSelected = selectedOption?.id === o.id;

                    return (
                      <div
                        key={o.id}
                        style={{
                          position: 'absolute',
                          top: virtualItem.start,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                        }}
                        className="hover:bg-accent flex cursor-pointer items-center px-3 text-sm"
                        onClick={() => {
                          onChange(String(o.id));
                          setIsOpen(false);
                        }}
                      >
                        <Check
                          className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
                        />
                        {o.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

function Field({
  label,
  required,
  error,
  helperText,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-sm leading-none font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && helperText && <p className="text-contrast/70 text-xs">{helperText}</p>}
    </div>
  );
}
