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
  simpleMode?: boolean;
}

export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    { className, date, onDateSelect, contentAlign = 'start', maxDateType, simpleMode, ...props },
    ref,
  ) => {
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
    } = useDatePicker({ onDateSelect, computedMaxDate, simpleMode });

    return (
      <>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              ref={ref}
              variant="outline"
              className="hover:border-primary group text-contrast/70 flex w-[230px] justify-between"
              onClick={handleTogglePopover}
              suppressHydrationWarning
              {...props}
            >
              <CalendarIcon className="group-hover:text-primary h-4 w-4 transition-colors duration-200" />
              <span className="group-hover:text-primary flex-1 transition-colors duration-200">
                {date?.from && date?.to ? (
                  <>
                    <span>{formatWithTz(date.from, 'yyyy-MM-dd')}</span>
                    {' ~ '}
                    <span>{formatWithTz(date.to, 'yyyy-MM-dd')}</span>
                  </>
                ) : (
                  <span className="text-contrast/30">기간을 선택해주세요</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          {isOpen && (
            <PopoverContent
              className="bg-background w-auto"
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
                <div className="border-foreground/10 flex flex-col gap-1 border-r pr-4 text-left">
                  {dateRanges.map(({ label, start, end, disabled }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      className={cn(
                        'bg-foreground text-contrast justify-start',
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
