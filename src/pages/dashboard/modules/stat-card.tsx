import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/atoms/tooltip';

type StatCardProps = {
  stat: {
    title: (isRealtime?: boolean) => string;
    unit: string;
    tooltip: (isRealtime?: boolean) => string;
    isHighlight: boolean;
  };
  value: number;
  periodType: string;
};

export default function StatCard({ stat, value, periodType }: StatCardProps) {
  const { title, unit, tooltip, isHighlight } = stat;
  const isRealtime = periodType === 'realtime';
  const isActive = isRealtime && isHighlight;

  return (
    <div
      className={`bg-background border-border/80 flex flex-1 flex-col gap-2 rounded-lg border p-6 shadow-sm ${isActive ? 'bg-foreground/30' : ''}`}
    >
      <div className="flex items-center justify-between text-sm font-medium">
        <p className={`${isActive ? 'text-blue-800 dark:text-blue-600' : 'text-contrast/50'}`}>
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
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-medium ${isActive ? 'text-blue-900 dark:text-blue-600' : 'text-contrast'}`}
        >
          {value ? value.toLocaleString() : '-'}
        </span>
        <span className={`text-sm font-normal ${isActive ? 'text-blue-600' : 'text-contrast'}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}
