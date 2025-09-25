import Spreadsheet from 'react-spreadsheet';
import { TableProperties, CalendarDays } from 'lucide-react';
import { type CellBase, type Matrix } from 'react-spreadsheet';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/atoms/button';
import { Calendar } from '@/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover';
import { usePurchase } from '../hooks/usePurchase';

import '../index.css';

export default function VegetablePurchase() {
  const {
    selectedDate,
    purchaseData,
    isCalendarOpen,
    setIsCalendarOpen,
    handleDateSelect,
    handleChange,
    totalItems,
    calculateSummaryBySupplier,
    handlePurchaseOrder,
    isDateDisabled,
  } = usePurchase();

  return (
    <div className="bg-background text-contrast flex h-full flex-col p-8">
      <div className="mb-2 flex items-center">
        <p className="text-xl font-bold">야채 매입</p>
      </div>

      <div className="border-border/50 flex items-center justify-between border p-4">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <div className="flex items-center gap-2">
            <span className="text-sm">납품 예정일 : </span>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <CalendarDays className="h-3 w-3" />
                {selectedDate
                  ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })
                  : '날짜를 선택해주세요'}
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="bg-background w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="border-border/50 min-h-0 flex-1 border border-t-0 p-4">
        {!selectedDate ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="bg-foreground mb-4 rounded-full p-6">
              <CalendarDays className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">납품 예정일을 선택해주세요.</h3>
            <p className="text-gray-500">상단의 달력 버튼을 클릭하여 납품 예정일을 선택하세요.</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <TableProperties className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">출력 가능한 주문 데이터가 없습니다.</h3>
          </div>
        ) : (
          <div className="flex h-full flex-1 gap-4">
            <div className="relative h-full flex-1 overflow-auto bg-white">
              <div className={`h-full`}>
                <Spreadsheet
                  data={purchaseData?.table_data as any as Matrix<CellBase>}
                  onChange={handleChange}
                  columnLabels={[
                    '매입사',
                    '상품ID',
                    '상품명',
                    '판매수량',
                    '매입수량',
                    '평균판매금액',
                    '판매설정금액',
                    '기준매입단가',
                    '매입단가',
                    '합계금액',
                    '기준매입단가 수정여부',
                  ]}
                />
              </div>
            </div>

            <div className="bg-background-50 flex h-full w-80 flex-col gap-4 rounded-lg p-2">
              <div className="bg-background border-border/50 rounded-md border p-4">
                <div className="flex items-center gap-1">
                  <span className="text-xs">주문일자 :</span>
                  <span className="text-xs">{purchaseData?.order_aggregation_period}</span>
                </div>
              </div>

              <div className="bg-background border-border/50 flex min-h-0 flex-1 flex-col rounded-md border p-4">
                <h3 className="mb-3 text-xs">매입요약</h3>
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                  {Object.entries(calculateSummaryBySupplier()).map(([supplier, summary]) => (
                    <div key={supplier} className="bg-foreground rounded-md px-3 py-2 text-sm">
                      <div className="grid grid-cols-2 items-center gap-2 text-xs">
                        <div className="flex gap-1 font-medium">
                          <span>{supplier}</span>
                          <span className="text-contrast/50">({summary.productCount})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-contrast/70">합계금액</div>
                          <div className="font-semibold">{summary.total.toLocaleString()}원</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handlePurchaseOrder}>매입하기</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
