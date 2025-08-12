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
  isDashboard?: boolean; // 간단한 모드 (이번달, 지난달, 지지난달만 표시)
};

export const useDatePicker = ({
  onDateSelect,
  computedMaxDate,
  isDashboard = false,
}: DatePickerProps) => {
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

  const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const thisMonthStart = startOfMonth(today);
  const lastMonthDate = subDays(today, today.getDate());
  const lastMonthStart = startOfMonth(lastMonthDate);
  const lastMonthEnd = endOfMonth(lastMonthDate);
  const lastYearDate = subDays(today, 365);

  const createDateRange = (label: string, start: Date, end: Date, disabled = false) => ({
    label,
    start,
    end,
    ...(disabled && { disabled }),
  });

  const dashboardDateRanges = [
    createDateRange(
      DATE_RANGE_OPTIONS.LAST_2_MONTHS,
      startOfMonth(subDays(lastMonthStart, 1)),
      endOfMonth(subDays(lastMonthStart, 1)),
    ),
    createDateRange(DATE_RANGE_OPTIONS.LAST_MONTH, lastMonthStart, lastMonthEnd),
    createDateRange(
      DATE_RANGE_OPTIONS.THIS_MONTH,
      thisMonthStart,
      computedMaxDate,
      computedMaxDate < thisMonthStart,
    ),
  ];

  const defalutDateRanges = [
    createDateRange(
      DATE_RANGE_OPTIONS.THIS_WEEK,
      thisWeekStart,
      computedMaxDate,
      computedMaxDate < thisWeekStart,
    ),
    createDateRange(
      DATE_RANGE_OPTIONS.LAST_WEEK,
      subDays(thisWeekStart, 7),
      subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    ),
    createDateRange(DATE_RANGE_OPTIONS.LAST_7_DAYS, subDays(computedMaxDate, 6), computedMaxDate),
    createDateRange(
      DATE_RANGE_OPTIONS.THIS_MONTH,
      thisMonthStart,
      computedMaxDate,
      computedMaxDate < thisMonthStart,
    ),
    createDateRange(DATE_RANGE_OPTIONS.LAST_MONTH, lastMonthStart, lastMonthEnd),
    createDateRange(DATE_RANGE_OPTIONS.THIS_YEAR, startOfYear(today), computedMaxDate),
    createDateRange(
      DATE_RANGE_OPTIONS.LAST_YEAR,
      startOfYear(lastYearDate),
      endOfYear(lastYearDate),
    ),
  ];

  const dateRanges = isDashboard ? dashboardDateRanges : defalutDateRanges;

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
