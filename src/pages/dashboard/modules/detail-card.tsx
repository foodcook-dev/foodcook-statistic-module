import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { DashboardApiResponse } from '@/pages/dashboard/types/dashboard';

interface DetailCardProps {
  dateRange: DateRange;
  periodType: string;
  data?: DashboardApiResponse;
}

interface SimpleRowProps {
  label: string;
  value: number | undefined;
  className?: string;
  showBorder?: boolean;
}

interface ExpandableRowProps {
  label: string;
  value: number | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

const formatCurrency = (value: number | undefined): string => {
  return `${(value || 0).toLocaleString()} 원`;
};

const formatPercentage = (value: number | undefined): string => {
  return value ? `${value} %` : '-';
};

const SimpleRow = ({ label, value, className = '', showBorder = true }: SimpleRowProps) => (
  <div
    className={`flex items-center justify-between py-2 ${showBorder ? 'border-border/50 border-b' : ''}`}
  >
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
        <button
          onClick={onToggle}
          className="hover:bg-foreground flex h-5 w-5 items-center justify-center rounded text-gray-500 transition-all duration-200 hover:text-blue-600"
          type="button"
        >
          <span className="text-xs" aria-hidden="true">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>
      </div>
      <span className={`text-blue-600 ${className}`}>{formatCurrency(value)}</span>
    </div>
  </div>
);

const DetailRowSmall = ({ label, value }: { label: string; value: number | undefined }) => (
  <div className="flex items-center justify-between py-1">
    <span>{label}</span>
    <span className="font-medium">{formatCurrency(value)}</span>
  </div>
);

const RevenueDetailsPanel = ({ data }: { data?: DashboardApiResponse }) => (
  <div className="border-border/50 bg-background text-contrast space-y-2 rounded-lg border px-3 py-2 text-xs">
    <DetailRowSmall label="매출 주문" value={data?.sales_revenue} />
    <DetailRowSmall label="앱 매출" value={data?.app_revenue} />
    <DetailRowSmall label="타사 매출" value={data?.external_revenue} />
    <hr className="border-border/30 my-2" />
    <DetailRowSmall label="총 과세" value={data?.total_tax_amount} />
    <DetailRowSmall label="총 비과세" value={data?.total_tax_free_amount} />
  </div>
);

export default function DetailCard({ dateRange, periodType, data }: DetailCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails((prev) => !prev);

  const title =
    periodType === 'realtime'
      ? '일간 매출액'
      : `${format(dateRange.from!, 'yyyy-MM-dd')} - ${format(dateRange.to!, 'yyyy-MM-dd')} 매출액`;

  return (
    <div className="border-border/50 col-span-1 flex h-full flex-col gap-3 rounded-lg border p-6 shadow-sm">
      <h3 className="border-border/50 text-contrast border-b pb-2 text-lg font-semibold">
        {title}
      </h3>
      <div className="space-y-3 text-sm">
        <SimpleRow label="매출액" value={data?.revenue} />
        <SimpleRow
          label="부분환불금액"
          value={data?.partial_cancel_revenue}
          className="text-red-600"
        />
        <SimpleRow label="부가세" value={data?.vat} className="text-contrast" />
        <ExpandableRow
          label="합계금액"
          value={data?.total_revenue}
          isExpanded={showDetails}
          onToggle={toggleDetails}
        />
        {showDetails && <RevenueDetailsPanel data={data} />}
        <SimpleRow label="매입액" value={data?.purchase_amount} />
        <div className="flex items-center justify-between py-2">
          <span>GP 마진율</span>
          <span>{formatPercentage(data?.gross_profit_margin)}</span>
        </div>
      </div>
    </div>
  );
}
