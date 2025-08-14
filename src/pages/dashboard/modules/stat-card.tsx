import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/atoms/tooltip';

type StatCardProps = {
  title: string;
  value: number;
  unit: string;
  tooltip?: string;
  isRealtime?: boolean;
};

export default function StatCard({
  title,
  value,
  unit,
  tooltip,
  isRealtime = false,
}: StatCardProps) {
  return (
    <div
      className={`bg-background border-border/80 flex flex-col gap-2 rounded-lg border p-6 shadow-sm ${isRealtime ? 'bg-foreground/30' : ''}`}
    >
      <div className="flex items-center justify-between text-sm font-medium">
        <p className={`${isRealtime ? 'text-blue-800 dark:text-blue-600' : 'text-contrast/50'}`}>
          {title}
        </p>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 cursor-pointer text-gray-400" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-medium ${isRealtime ? 'text-blue-900 dark:text-blue-600' : 'text-contrast'}`}
        >
          {value ? value.toLocaleString() : '-'}
        </span>
        <span className={`text-sm font-normal ${isRealtime ? 'text-blue-600' : 'text-contrast'}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}
