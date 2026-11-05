import ActiveFilterChip from '@/components/modules/active-filter-chip';

interface GridSummaryBarProps {
  count: number | null;
  countUnit: string;
  amount: number | null;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function GridSummaryBar({
  count,
  countUnit,
  amount,
  isFiltered,
  onResetFilters,
}: GridSummaryBarProps) {
  const skeleton = (width: string) => (
    <span className={`inline-block h-5 ${width} bg-contrast/10 animate-pulse rounded-sm`} />
  );

  return (
    <div className="bg-foreground border-border border-t-primary text-contrast flex h-14 items-center justify-between rounded-b-lg border-x border-t-2 border-b px-5">
      <div className="flex items-center gap-3 text-sm">
        {count != null ? (
          <span className="text-md font-semibold">
            {count.toLocaleString()}
            <span className="text-contrast/60 ml-0.5 text-sm font-semibold">{countUnit}</span>
          </span>
        ) : (
          skeleton('w-16')
        )}
        {isFiltered && (
          <>
            <span className="bg-border h-4 w-px" />
            <ActiveFilterChip isFiltered={isFiltered} onReset={onResetFilters} />
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-contrast/70 flex items-center gap-1.5 text-sm font-semibold">
          총 매입액
        </span>
        <span className="bg-border h-5 w-px" />
        {amount != null ? (
          <span className="text-md font-semibold">
            {amount.toLocaleString()}
            <span className="text-contrast/60 ml-1 text-sm font-semibold">원</span>
          </span>
        ) : (
          skeleton('w-28')
        )}
      </div>
    </div>
  );
}

export default GridSummaryBar;
