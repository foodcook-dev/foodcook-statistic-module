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
  onDateSelect: (range: { from: Date; to: Date }) => void;
  contentAlign?: 'start' | 'center' | 'end';
}

export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({ className, date, onDateSelect, contentAlign = 'start', ...props }, ref) => {
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
    } = useDatePicker({ onDateSelect });

    return (
      <>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              ref={ref}
              variant="outline"
              className="w-[235px] flex justify-between"
              onClick={handleTogglePopover}
              suppressHydrationWarning
              {...props}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
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
              className="w-auto"
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
                  {dateRanges.map(({ label, start, end }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'justify-start bg-white hover:bg-gray-100 hover:text-gray-900',
                        selectedOption === label && 'bg-gray-200 text-gray-900 hover:!bg-gray-300',
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
                  className={className}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                />
              </div>
            </PopoverContent>
          )}
        </Popover>
      </>
    );
  },
);
