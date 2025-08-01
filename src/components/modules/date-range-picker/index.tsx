'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/libs/utils';
import { Button } from '@/components/atoms/button';
import { Calendar } from '@/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover';
import { useDatePicker } from './model/useDatePicker';

interface DateRangePickerProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  date: DateRange;
  maxDateType: 'today' | 'yesterday';
  onDateSelect: (range: { from: Date; to: Date }) => void;
  contentAlign?: 'start' | 'center' | 'end';
}

export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({ className, date, onDateSelect, contentAlign = 'start', maxDateType, ...props }, ref) => {
    const computedMaxDate = React.useMemo(() => {
      if (maxDateType === 'yesterday') return new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (maxDateType === 'today') return new Date();
      return new Date();
    }, [maxDateType]);

    const {
      isOpen,
      selectedOption,
      calendarMonth,
      dateRanges,
      setIsOpen,
      setSelectedOption,
      setCalendarMonth,
      handleClose,
      handleTogglePopover,
      selectDateRange,
      handleDateSelect,
      formatWithTz,
    } = useDatePicker({ onDateSelect, computedMaxDate });

    return (
      <>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              ref={ref}
              variant="outline"
              className="w-[230px] flex justify-between hover:border-primary group"
              onClick={handleTogglePopover}
              suppressHydrationWarning
              {...props}
            >
              <CalendarIcon className="h-4 w-4 group-hover:text-primary transition-colors duration-200" />
              <span className="group-hover:text-primary transition-colors duration-200">
                {date?.from && date?.to ? (
                  <>
                    <span>{formatWithTz(date.from, 'yyyy-MM-dd')}</span>
                    {' ~ '}
                    <span>{formatWithTz(date.to, 'yyyy-MM-dd')}</span>
                  </>
                ) : (
                  <span>기간을 선택하세요</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          {isOpen && (
            <PopoverContent
              className="w-auto bg-background"
              align={contentAlign}
              avoidCollisions={false}
              onInteractOutside={handleClose}
              onEscapeKeyDown={handleClose}
              style={{
                maxHeight: 'var(--radix-popover-content-available-height)',
                overflowY: 'auto',
              }}
            >
              <div className="flex">
                <div className="flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
                  {dateRanges.map(({ label, start, end, disabled }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      className={cn(
                        'justify-start bg-foreground text-contrast',
                        selectedOption === label && 'bg-gray-200 text-gray-900',
                      )}
                      onClick={() => {
                        selectDateRange(start, end);
                        setSelectedOption(label);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  showOutsideDays={false}
                  className={cn('text-contrast', className)}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  disabled={computedMaxDate ? { after: computedMaxDate } : undefined}
                />
              </div>
            </PopoverContent>
          )}
        </Popover>
      </>
    );
  },
);
