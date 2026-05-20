import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getPartnerCompany } from '@/libs/partial-refund';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FieldWrapper } from '@/components/modules/FormField';

import { cn } from '@/utils/common';
import { useQuery } from '@tanstack/react-query';

const ITEM_HEIGHT = 36;
const MAX_VISIBLE = 8; // 최대 보여줄 개수

type PartnerCompanySelectProps = {
  id: string;
  name: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  className?: string;
};

export function PartnerCompanySelect(props: PartnerCompanySelectProps) {
  const {
    name,
    helperText,
    className = '',
    id,
    value,
    onChange,
    placeholder = '선택해주세요',
    disabled = false,
  } = props;

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

  const { data: partnerCompanies = [] } = useQuery({
    queryKey: ['partnerCompanies'],
    queryFn: getPartnerCompany,
  });

  const filteredOptions = useMemo(() => {
    if (!search) return partnerCompanies;
    return partnerCompanies.filter((o: any) => o.b_nm.toLowerCase().includes(search.toLowerCase()));
  }, [partnerCompanies, search]);

  const selectedOption = useMemo(
    () => partnerCompanies.find((o: any) => String(o.id) === String(value)) ?? null,
    [partnerCompanies, value],
  );

  const listHeight = Math.min(filteredOptions.length * ITEM_HEIGHT, MAX_VISIBLE * ITEM_HEIGHT);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 36,
    overscan: 5,
    enabled: isOpen,
  });

  return (
    <FieldWrapper name={name} label={''} helperText={helperText}>
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
            disabled={disabled}
            className={cn(
              'bg-background h-7 w-full justify-between text-[12px] font-normal',
              className,
            )}
          >
            <span
              className={`truncate ${selectedOption?.b_nm ? 'text-contrast' : 'text-contrast/50'}`}
            >
              {selectedOption?.b_nm ?? placeholder}
            </span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex flex-col">
            <div className="border-border border-b px-3 py-2">
              <input
                className="placeholder:text-contrast/40 w-full bg-transparent text-xs outline-none"
                placeholder="검색어를 입력해주세요"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  virtualizer.scrollToIndex(0);
                }}
              />
            </div>

            <div
              className="hover:bg-accent flex cursor-pointer items-center px-2 py-2 text-xs"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
            >
              <Check
                className={cn('mr-1 h-4 w-4', !selectedOption ? 'opacity-100' : 'opacity-0')}
              />
              선택 안 함
            </div>

            {filteredOptions.length === 0 ? (
              <div className="text-contrast/40 py-6 text-center text-xs">검색 결과가 없습니다</div>
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
                        className="hover:bg-accent flex cursor-pointer items-center px-2 text-xs"
                        onClick={() => {
                          onChange(o.id);
                          setIsOpen(false);
                        }}
                      >
                        <Check
                          className={cn('mr-1 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
                        />
                        {o.b_nm}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
