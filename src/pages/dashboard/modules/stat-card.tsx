import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/atoms/tooltip';
import LoadingSpinner from '@/components/atoms/loading-spinner';
import { DashboardResponse } from '@/pages/dashboard/types/dashboard';
import { STAT_LIST } from '../structure';

interface StatCardProps {
  isLoading: boolean;
  isFetching: boolean;
  data: DashboardResponse;
  periodType: string;
}

export default function StatCard({ isLoading, isFetching, data, periodType }: StatCardProps) {
  const isRealtime = periodType === 'realtime';

  if (isLoading) {
    return (
      <div className="flex h-[110px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {STAT_LIST.map((stat, index) => {
        const { id, title, tooltip, unit, isHighlight } = stat;
        const isActive = isRealtime && isHighlight;
        const isShowSpinner = isLoading || (isRealtime && isHighlight && isFetching);
        const value = data?.[id as keyof DashboardResponse];

        if (!isLoading && value === undefined) return null;

        return (
          <div
            key={index}
            className={`bg-background border-border/80 flex flex-1 flex-col gap-2 rounded-lg border p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between text-sm font-medium">
              <p
                className={`${isActive ? 'text-blue-800 dark:text-blue-600' : 'text-contrast/50'}`}
              >
                {title(isRealtime)}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 cursor-pointer text-gray-400" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{tooltip(isRealtime)}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className={`flex items-baseline gap-1 ${isActive ? 'text-blue-900 dark:text-blue-600' : 'text-contrast'}`}
            >
              {isShowSpinner ? (
                <LoadingSpinner size="md" />
              ) : (
                <>
                  <span className={`text-2xl font-medium`}>
                    {value ? value.toLocaleString() : '-'}
                  </span>
                  <span className={`text-sm font-normal`}>{value ? unit : ''}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
