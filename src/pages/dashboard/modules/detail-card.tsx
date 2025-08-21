import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/atoms/button';
import LoadingSpinner from '@/components/atoms/loading-spinner';
import { DashboardResponse } from '@/pages/dashboard/types/dashboard';
import {
  SimpleRowProps,
  ExpandableRowProps,
  DetailCardProps,
} from '@/pages/dashboard/types/dashboard';

const formatCurrency = (value: number | undefined): string => {
  return value ? `${(value || 0).toLocaleString()} 원` : '-';
};

const formatPercentage = (value: number | undefined): string => {
  return value ? `${value} %` : '-';
};

const SimpleRow = ({ label, value, className = '' }: SimpleRowProps) => (
  <div className={`border-border/50 flex items-center justify-between border-b py-2`}>
    <span>{label}</span>
    <span className={className}>{formatCurrency(value)}</span>
  </div>
);

const ExpandableRow = ({
  label,
  value,
  isExpanded,
  onToggle,
  className = '',
}: ExpandableRowProps) => (
  <div className="border-border/50 border-b py-2 font-semibold">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <Button
          variant="ghost"
          className="hover:bg-foreground flex h-5 w-4 items-center justify-center rounded px-3 text-xs text-gray-500 hover:text-blue-600"
          onClick={onToggle}
        >
          {isExpanded ? '▲' : '▼'}
        </Button>
      </div>
      <span className={`text-blue-600 ${className}`}>{formatCurrency(value)}</span>
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: number | undefined }) => (
  <div className="flex items-center justify-between py-1">
    <span>{label}</span>
    <span className="font-medium">{formatCurrency(value)}</span>
  </div>
);

const RevenueDetailsPanel = ({ data }: { data?: DashboardResponse }) => (
  <div className="border-border/50 bg-background text-contrast space-y-2 rounded-lg border px-3 py-2 text-xs">
    <DetailRow label="매출 주문" value={data?.sales_revenue} />
    <DetailRow label="앱 매출" value={data?.app_revenue} />
    <DetailRow label="타사 매출" value={data?.external_revenue} />
    <hr className="border-border/30 my-2" />
    <DetailRow label="총 과세" value={data?.total_tax_amount} />
    <DetailRow label="총 비과세" value={data?.total_tax_free_amount} />
  </div>
);

export default function DetailCard({
  isLoading,
  isFetching,
  data,
  dateRange,
  periodType,
}: DetailCardProps) {
  const {
    revenue,
    partial_cancel_revenue,
    vat,
    total_revenue,
    purchase_amount,
    gross_profit_margin,
  } = data;
  const isRealtime = periodType === 'realtime';
  const isShowSpinner = isLoading || (isRealtime && isFetching) || !data;
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails((prev) => !prev);

  const title = isRealtime
    ? '출고 매출액'
    : `${format(dateRange.from!, 'yyyy-MM-dd')} - ${format(dateRange.to!, 'yyyy-MM-dd')} 매출액`;

  return (
    <div className="border-border/50 col-span-1 flex h-full flex-col gap-3 rounded-lg border p-6 shadow-sm">
      <h3 className="border-border/50 text-contrast border-b pb-2 text-lg font-semibold">
        {title}
      </h3>
      {isShowSpinner ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="text-contrast space-y-3 text-sm">
          <SimpleRow label="매출액" value={revenue} />
          <SimpleRow label="부분환불금액" value={partial_cancel_revenue} className="text-red-600" />
          <SimpleRow label="부가세" value={vat} />
          <ExpandableRow
            label="합계금액"
            value={total_revenue}
            isExpanded={showDetails}
            onToggle={toggleDetails}
          />
          {showDetails && <RevenueDetailsPanel data={data} />}
          {purchase_amount !== undefined && <SimpleRow label="매입액" value={purchase_amount} />}
          {gross_profit_margin !== undefined && (
            <div className="flex items-center justify-between py-2">
              <span>GP 마진율</span>
              <span>{formatPercentage(gross_profit_margin)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
