import dayjs from 'dayjs';

// 날짜 문자열을 'YYYY-MM-DD 오전/오후 h:m:s' 형식으로 변환 (예: '2026-11-05 13:05:09' → '2026-11-05 오후 1:5:9')
export const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = dayjs(value);
  if (!date.isValid()) return value;
  const meridiem = date.hour() < 12 ? '오전' : '오후';
  return date.format(`YYYY-MM-DD [${meridiem}] h:m:s`);
};
