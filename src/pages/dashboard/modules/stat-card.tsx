import { InfoIcon, Activity } from 'lucide-react';
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
      className={`bg-background border-border/50 flex flex-col gap-2 rounded-lg border p-6 shadow-sm transition-all duration-200 ${
        isRealtime ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
      } `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${isRealtime ? 'text-blue-800' : 'text-gray-600'}`}>
            {title}
          </p>
          {isRealtime && <Activity className="h-3 w-3 text-blue-500" />}
        </div>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 cursor-pointer text-gray-300" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-medium ${isRealtime ? 'text-blue-900' : 'text-gray-900'}`}>
          {value ? value.toLocaleString() : '-'}
        </span>
        <span className={`text-sm font-normal ${isRealtime ? 'text-blue-600' : 'text-gray-500'}`}>
          {unit || '-'}
        </span>
      </div>
    </div>
  );
}
