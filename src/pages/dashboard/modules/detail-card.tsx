import { useState } from 'react';
import { DashboardApiResponse } from '@/pages/dashboard/types/dashboard';

interface DetailCardProps {
  data?: DashboardApiResponse;
}

export default function DetailCard({ data }: DetailCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const revenue = data?.revenue || 0;
  const partialCancel = data?.partial_cancel_revenue || 0;
  const vat = data?.vat || 0;
  const totalAmount = revenue - partialCancel + vat;

  return (
    <div className="bg-background border-border/50 flex h-full flex-col gap-3 rounded-lg border p-6 shadow-sm lg:col-span-1">
      <h3 className="border-border/50 text-contrast border-b pb-2 text-lg font-semibold">
        출고 매출액
      </h3>
      <div className="space-y-3 text-sm">
        <div className="border-border/50 flex items-center justify-between border-b py-2">
          <span>매출액</span>
          <span>{revenue.toLocaleString()} 원</span>
        </div>
        <div className="border-border/50 flex items-center justify-between border-b py-2">
          <span>부분환불금액</span>
          <span className="text-red-600">{partialCancel.toLocaleString()} 원</span>
        </div>
        <div className="border-border/50 flex items-center justify-between border-b py-2">
          <span>부가세</span>
          <span className="text-contrast">{vat.toLocaleString()} 원</span>
        </div>
        <div className="border-border/50 border-b py-2 font-semibold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>합계금액</span>
              <button
                onClick={toggleDetails}
                className="hover:bg-foreground flex h-5 w-5 items-center justify-center rounded text-gray-500 transition-all duration-200 hover:text-blue-600"
                title={showDetails ? '상세정보 숨기기' : '상세정보 보기'}
              >
                <span className="text-xs">{showDetails ? '▲' : '▼'}</span>
              </button>
            </div>
            <span className="text-blue-600">{totalAmount.toLocaleString()} 원</span>
          </div>
        </div>

        {showDetails && (
          <div className="border-border/50 bg-background rounded-lg border px-3 py-2">
            <div className="text-contrast space-y-2 text-xs">
              <div className="flex items-center justify-between py-1">
                <span>매출주문</span>
                <span className="font-medium">
                  {(data?.sales_revenue || 0).toLocaleString()} 원
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>앱매출</span>
                <span className="font-medium">{(data?.app_revenue || 0).toLocaleString()} 원</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>타사매출</span>
                <span className="font-medium">
                  {(data?.external_revenue || 0).toLocaleString()} 원
                </span>
              </div>
              <hr className="my-2 border-gray-300" />
              <div className="flex items-center justify-between py-1">
                <span>총 과세</span>
                <span className="font-medium">
                  {(data?.total_tax_amount || 0).toLocaleString()} 원
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>총 비과세</span>
                <span className="font-medium">
                  {(data?.total_tax_free_amount || 0).toLocaleString()} 원
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="border-border/50 flex items-center justify-between border-b py-2">
          <span>매입액</span>
          <span>{(data?.inventory_asset || 0).toLocaleString()} 원</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span>GP 마진율</span>
          <span>{(data?.gross_profit_margin || 0).toFixed(1)} %</span>
        </div>
      </div>
    </div>
  );
}
