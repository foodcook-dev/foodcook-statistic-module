import Spreadsheet from 'react-spreadsheet';
import { useMemo } from 'react';
import { TableProperties, CalendarDays } from 'lucide-react';
import { type CellBase, type Matrix } from 'react-spreadsheet';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/atoms/button';
import { Calendar } from '@/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/atoms/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { usePurchase } from '../hooks/usePurchase';
// import { ThemeToggle } from '@/components/modules/theme-toggle';

import '../index.css';

function DropdownEditor({ cell, onChange, exitEditMode }: any) {
  const current = String(cell?.value ?? '').toUpperCase();
  const value = current === 'Y' || current === 'N' ? current : undefined;

  return (
    <div
      className="flex h-full w-full items-center overflow-hidden px-1"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Select
        value={value}
        onValueChange={(v) => {
          onChange({ ...cell, value: v });
          exitEditMode?.();
        }}
        disabled={cell?.readOnly}
      >
        <SelectTrigger size="sm" className="min-h-0 w-full rounded-sm text-xs">
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        <SelectContent disablePortal>
          <SelectItem value="Y">Y</SelectItem>
          <SelectItem value="N">N</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function VegetablePurchase() {
  const {
    selectedDate,
    purchaseData,
    isCalendarOpen,
    availableDates,
    isAllReadOnly,
    setIsCalendarOpen,
    handleDateSelect,
    handleChange,
    calculateSummary,
    handlePurchaseOrder,
    isDateUnavailable,
  } = usePurchase();

  const totalItems = purchaseData?.table_data?.length || 0;
  const availableDaysCount = availableDates?.available_date?.length || 0;

  const tableDataWithEditor = useMemo(() => {
    if (!purchaseData?.table_data) return [] as any;
    return purchaseData.table_data.map((row) =>
      row.map((cell, colIndex) => {
        if (colIndex === 10) {
          return { ...(cell as any), DataEditor: DropdownEditor } as any;
        }
        return cell as any;
      }),
    );
  }, [purchaseData]);

  return (
    <div className="bg-background text-contrast flex h-screen flex-col">
      {/* <ThemeToggle /> */}

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
            <div className="flex items-center text-xs">
              {availableDaysCount > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-blue-500/10 text-xs font-medium text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
                      onClick={() => handleDateSelect(availableDates?.available_date[0])}
                    >
                      매입 대기 {availableDaysCount}건
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">가장 오래된 매입 대기 건으로 이동</TooltipContent>
                </Tooltip>
              ) : (
                <span className="bg-foreground/70 text-contrast/70 rounded-sm px-3 py-2 font-medium">
                  매입 대기 건 없음
                </span>
              )}
            </div>
          </div>
          <PopoverContent className="bg-background w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={{
                unavailable: isDateUnavailable,
              }}
              modifiersClassNames={{
                unavailable: 'text-contrast/30',
              }}
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
            <div
              className={`relative h-full flex-1 overflow-auto bg-white ${isAllReadOnly ? 'spreadsheet-readonly' : ''}`}
            >
              <Spreadsheet
                data={tableDataWithEditor as any as Matrix<CellBase>}
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

            <div className="bg-background-50 flex h-full w-80 flex-col gap-4">
              <div className="bg-background border-border/50 rounded-md border p-4">
                <div className="flex items-center gap-1">
                  <span className="text-xs">주문일시 :</span>
                  <span className="text-xs">{purchaseData?.order_aggregation_period}</span>
                </div>
              </div>

              <div className="bg-background border-border/50 flex min-h-0 flex-1 flex-col rounded-md border p-4">
                <div className="mb-3 flex items-end gap-2">
                  <span className="text-xs">매입요약</span>
                  <span className="text-contrast/50 text-[10px]">
                    매입수량 * 매입단가 (미입력 항목 제외)
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                  {Object.entries(calculateSummary()).map(([supplier, summary]) => (
                    <div key={supplier} className="bg-foreground rounded-md px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex flex-1 gap-1 font-medium">
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

              <Button disabled={isAllReadOnly} onClick={handlePurchaseOrder}>
                매입하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
