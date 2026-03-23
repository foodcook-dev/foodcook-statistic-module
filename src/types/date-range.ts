import { DateRange } from 'react-day-picker';

export interface CalendarDatePickerProps extends React.HTMLAttributes<HTMLButtonElement> {
  id?: string;
  className?: string;
  date: DateRange;
  closeOnSelect?: boolean;
  numberOfMonths?: 1 | 2;
  onDateSelect: (range: { from: Date; to: Date }) => void;
  placeholder?: string;
}

export interface DateRangeOption {
  label: string;
  start: Date;
  end: Date;
}

export interface DatePickerState {
  isPopoverOpen: boolean;
  selectedRange: string | null;
  calendarMonth: Date;
}
