import { LabeledInput } from '@/components/modules/LabeledInput';
import { LabeledTextarea } from '@/components/modules/LabeledTextArea';
import { ToggleSwitch } from '@/components/modules/ToggleSwitch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { usePartialRefundForm } from '@/hooks/partial-refund/usePartialRefundForm';

export default function PartialRefund() {
  const {
    orderId,
    form,
    selectedItemIds,
    totalRefundAmount,
    onChange,
    onItemSelectToggle,
    onItemRefundAmountChange,
    onItemRestockQuantityChange,
    onItemSettlementExemptToggle,
    handlePartialRefund,
  } = usePartialRefundForm();

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <div className="border-gray300 bg-background flex w-full max-w-[900px] flex-col gap-6 rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          부분 환불
          <span className="ml-2 text-sm font-normal text-gray-500">주문 ID : {orderId}</span>
        </h2>

        <LabeledInput
          id="refund_method"
          name="refund_method"
          label="환불 수단"
          placeholder="주문시 사용한 결제수단입니다"
          value={form.refund_method ?? ''}
          onChange={() => {}}
          readOnly
        />

        <LabeledTextarea
          id="refund_reason"
          name="refund_reason"
          label="환불 사유"
          placeholder="환불 사유를 작성해주세요"
          value={form.refund_reason ?? ''}
          onChange={onChange}
          rows={3}
        />

        <LabeledTextarea
          id="memo"
          name="memo"
          label="관리자 메모"
          placeholder="메모를 입력해주세요."
          value={form.memo ?? ''}
          onChange={onChange}
          rows={2}
        />

        {/* 주문 상품 리스트 */}
        <div className="flex flex-col">
          <div className="border-border flex items-center gap-6 border-b pb-2">
            <span className="text-sm font-semibold">주문 상품</span>
          </div>

          <div className="text-contrast/50 border-border/80 flex items-center gap-4 border-b px-2 py-2 text-xs">
            <div className="w-3 shrink-0" />
            <div className="flex-1 px-1">상품 정보</div>
            <div className="w-12 shrink-0 text-center">수량</div>
            <div className="w-24 shrink-0 text-right">주문 금액</div>
            <div className="w-28 shrink-0 text-center">환불 금액</div>
            <div className="w-20 shrink-0 text-center">재고 복구</div>
            <div className="w-20 shrink-0 text-center">정산 제외 여부</div>
          </div>

          {form.order_items.map((item) => {
            const isDisabled = item.available_refund_amount <= 0;
            const isSelected = selectedItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`border-border/50 flex items-center gap-4 border-b px-2 py-3 transition-all ${
                  isDisabled ? 'bg-contrast/10 opacity-50' : isSelected ? 'bg-primary/10' : ''
                }`}
              >
                <div className="w-3 shrink-0">
                  {!isDisabled && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onItemSelectToggle(item.id)}
                      aria-label={`${item.name} 선택`}
                      disabled={isDisabled}
                    />
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="flex flex-1 flex-col px-1">
                  <p className="text-contrast/60 text-xs">{item.partner_company_name}</p>
                  <p className={`text-sm font-semibold ${isDisabled ? 'line-through' : ''}`}>
                    {item.name}
                  </p>
                </div>

                {/* 수량 */}
                <p className={`w-12 shrink-0 text-center text-sm`}>{item.count}</p>

                {/* 상품 금액 + 과세/비과세 */}
                <div className={`flex w-24 shrink-0 flex-col items-end gap-0.5`}>
                  <p className="text-sm font-medium">
                    {(item.price * item.count).toLocaleString()}원
                  </p>
                  <p className="text-contrast/70 text-[11px]">
                    (단가 {item.price.toLocaleString()}원)
                  </p>
                  <span className="text-contrast/50 text-[10px]">
                    {item.tax_state ? '과세상품' : '비과세상품'}
                  </span>
                </div>

                {/* 환불 금액 / 재고복구 / 토글 영역 */}
                {isDisabled ? (
                  <div className="text-contrast flex w-76 shrink-0 items-center justify-center text-xs font-semibold">
                    이미 환불 처리된 상품입니다
                  </div>
                ) : (
                  <>
                    <div className="flex w-28 shrink-0 items-end gap-1">
                      <Input
                        type="text"
                        value={item.refund_amount.toLocaleString()}
                        onChange={(e) => onItemRefundAmountChange(item.id, e.target.value)}
                        placeholder="0"
                        className={`w-full rounded-md border px-3 py-2 text-right text-sm font-medium ${
                          item.refund_amount > 0
                            ? 'border-primary focus:border-primary'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      <span className="text-[12px]">원</span>
                    </div>

                    <div className="flex w-20 shrink-0 items-end gap-1">
                      <Input
                        type="text"
                        value={item.restock_quantity.toLocaleString()}
                        onChange={(e) => onItemRestockQuantityChange(item.id, e.target.value)}
                        placeholder="0"
                        className={`w-full rounded-md border px-3 py-2 text-right text-sm font-medium ${
                          item.restock_quantity > 0
                            ? 'border-primary focus:border-primary'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      <span className="text-[12px]">개</span>
                    </div>

                    <div className="flex w-20 shrink-0 justify-center">
                      <ToggleSwitch
                        checked={item.settlement_exempt}
                        onChange={() => onItemSettlementExemptToggle(item.id)}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 금액 요약 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-end gap-8">
            <span className="text-contrast/50 text-xs">과세액</span>
            <span className="text-contrast/70 w-28 text-right text-xs">
              {form.order_tax_amount?.toLocaleString()} 원
            </span>
          </div>
          <div className="flex items-center justify-end gap-8">
            <span className="text-contrast/50 text-xs">비과세액</span>
            <span className="text-contrast/70 w-28 text-right text-xs">
              {form.order_tax_free_amount?.toLocaleString()} 원
            </span>
          </div>
          <div className="flex items-center justify-end gap-8">
            <span className="text-sm text-gray-600">총 주문 금액</span>
            <span className="w-28 text-right text-sm text-gray-900">
              {form.order_amount?.toLocaleString()} 원
            </span>
          </div>
          <div className="mt-2 flex items-center justify-end gap-8 border-t border-gray-100 pt-2">
            <span className="text-sm font-semibold text-gray-900">환불 금액</span>
            <span className="w-28 text-right text-base font-semibold text-red-500">
              {totalRefundAmount.toLocaleString()} 원
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handlePartialRefund}>환불</Button>
        </div>
      </div>
    </div>
  );
}
