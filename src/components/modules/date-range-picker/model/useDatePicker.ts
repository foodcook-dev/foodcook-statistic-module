import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { toDate, formatInTimeZone } from 'date-fns-tz';
import { DATE_RANGE_OPTIONS } from '../constants';

type DatePickerProps = {
  onDateSelect: (range: { from: Date; to: Date }) => void;
};

export const useDatePicker = ({ onDateSelect }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    DATE_RANGE_OPTIONS.THIS_MONTH,
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleClose = () => setIsOpen(false);

  const handleTogglePopover = () => setIsOpen((prev) => !prev);

  const selectDateRange = (from: Date, to: Date) => {
    const startDate = startOfDay(toDate(from, { timeZone }));
    const endDate = endOfDay(toDate(to, { timeZone }));
    onDateSelect({ from: startDate, to: endDate });
    setCalendarMonth(startOfMonth(startDate)); // 해당 날짜가 속한 월의 첫 번째 날로 설정
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      let from = startOfDay(toDate(range.from as Date, { timeZone }));
      let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from;
      onDateSelect({ from, to });
    }
    setSelectedOption(null);
  };

  const today = new Date();
  const dateRanges = [
    {
      label: DATE_RANGE_OPTIONS.THIS_WEEK,
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: DATE_RANGE_OPTIONS.LAST_WEEK,
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    { label: DATE_RANGE_OPTIONS.LAST_7_DAYS, start: subDays(today, 6), end: today },
    {
      label: DATE_RANGE_OPTIONS.THIS_MONTH,
      start: startOfMonth(today),
      // end: endOfMonth(today),
      end: today,
    },
    {
      label: DATE_RANGE_OPTIONS.LAST_MONTH,
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    {
      label: DATE_RANGE_OPTIONS.THIS_YEAR,
      start: startOfYear(today),
      // end: endOfYear(today),
      end: today,
    },
    {
      label: DATE_RANGE_OPTIONS.LAST_YEAR,
      start: startOfYear(subDays(today, 365)),
      end: endOfYear(subDays(today, 365)),
    },
  ];

  const formatWithTz = (date: Date, fmt: string) => formatInTimeZone(date, timeZone, fmt);

  return {
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
  };
};
