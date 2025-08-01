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
  isSameDay,
} from 'date-fns';
import { toDate, formatInTimeZone } from 'date-fns-tz';
import { DATE_RANGE_OPTIONS } from '../constants';

type DatePickerProps = {
  onDateSelect: (range: { from: Date; to: Date }) => void;
  computedMaxDate: Date;
};

export const useDatePicker = ({ onDateSelect, computedMaxDate }: DatePickerProps) => {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    isSameDay(computedMaxDate, today) ? DATE_RANGE_OPTIONS.THIS_MONTH : null,
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

  const dateRanges = [
    {
      // 이번주 (오늘 날짜 기준 주의 시작 날짜 ~ 설정된 MaxDate 까지)
      // 설정된 MaxDate가 주의 시작 날짜보다 이전이면 비활성화
      label: DATE_RANGE_OPTIONS.THIS_WEEK,
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: computedMaxDate,
      disabled: computedMaxDate < startOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      // 지난주 (오늘날짜 기준)
      label: DATE_RANGE_OPTIONS.LAST_WEEK,
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    {
      // 최근 7일간 (설정된 MaxDate 기준 6일 전 ~ MaxDate)
      label: DATE_RANGE_OPTIONS.LAST_7_DAYS,
      start: subDays(computedMaxDate, 6),
      end: computedMaxDate,
    },
    {
      // 이번달 (오늘 날짜 기준 이번달 1일 ~ 설정된 MaxDate)
      // 설정된 MaxDate가 이번달 1일보다 이전이면 비활성화
      label: DATE_RANGE_OPTIONS.THIS_MONTH,
      start: startOfMonth(today),
      end: computedMaxDate,
      disabled: computedMaxDate < startOfMonth(today),
    },
    {
      // 지난달 (오늘 날짜 기준 지난달 1일 ~ 지난달 마지막 날)
      label: DATE_RANGE_OPTIONS.LAST_MONTH,
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    {
      label: DATE_RANGE_OPTIONS.THIS_YEAR,
      start: startOfYear(today),
      end: computedMaxDate,
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
