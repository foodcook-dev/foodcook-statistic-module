import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/button';

interface DebugPanelProps {
  refetch?: () => void;
  dashboardData?: any;
  isLoading?: boolean;
}

export default function DebugPanel({ refetch, dashboardData, isLoading }: DebugPanelProps) {
  const [fetchCount, setFetchCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  useEffect(() => {
    if (dashboardData) {
      setFetchCount((prev) => prev + 1);
      setLastFetchTime(new Date());
    }
  }, [dashboardData]);

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg bg-gray-900 p-4 text-white shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">Debug Panel</h3>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-400">총 페치 횟수:</span>
          <span className="ml-2 font-mono text-green-400">{fetchCount}</span>
        </div>

        <div>
          <span className="text-gray-400">마지막 페치:</span>
          <div className="ml-2 font-mono text-blue-400">
            {lastFetchTime ? lastFetchTime.toLocaleTimeString() : '없음'}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-2">
          <Button
            size="sm"
            onClick={() => {
              console.log('수동 리패치 실행');
              refetch?.();
            }}
            className="w-full bg-blue-600 text-xs text-white hover:bg-blue-700"
          >
            수동 리패치
          </Button>
        </div>

        <div className="text-center text-[10px] text-gray-500">10초마다 자동 업데이트</div>
      </div>
    </div>
  );
}
