import { Filter, X } from 'lucide-react';

interface ActiveFilterChipProps {
  /** 그리드에 필터가 하나라도 걸려 있는지. false면 아무것도 렌더링하지 않는다. */
  isFiltered: boolean;
  onReset: () => void;
}

// 그리드 필터가 걸려 있을 때만 나타나는 표시 (× 클릭 시 모든 필터 해제)
export function ActiveFilterChip({ isFiltered, onReset }: ActiveFilterChipProps) {
  if (!isFiltered) return null;

  return (
    <span className="border-primary/30 bg-primary/10 text-primary flex h-7 items-center gap-1.5 rounded-full border pr-1 pl-2.5 text-xs font-medium">
      <Filter className="h-3.5 w-3.5" />
      필터 적용 중
      <button
        type="button"
        onClick={onReset}
        aria-label="필터 전체 해제"
        title="필터 전체 해제"
        className="hover:bg-primary/15 flex h-5 w-5 items-center justify-center rounded-full transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export default ActiveFilterChip;
