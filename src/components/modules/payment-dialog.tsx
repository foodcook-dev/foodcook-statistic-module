import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';

interface PaymentDialogProps {
  onSubmit: (data: PaymentData) => void;
}

export interface PaymentData {
  processDate: Date;
  amount: number | null;
  // manager: string;
  notes: string;
}

export default function PaymentDialog({ onSubmit }: PaymentDialogProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const today = new Date();
  const [formData, setFormData] = useState<PaymentData>({
    processDate: today,
    amount: null,
    notes: '',
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setFormData({ ...formData, amount: null });
      return;
    }

    const parsedValue = parseInt(numericValue);
    setFormData({ ...formData, amount: parsedValue });
  };

  const handleSubmit = () => {
    if (!formData.amount) {
      alert('결제금액은 필수 입력 항목입니다.');
      return;
    }

    onSubmit(formData);
    setPaymentDialogOpen(false);
    setFormData({
      processDate: today,
      amount: null,
      notes: '',
    });
  };

  const handleCancel = () => {
    setPaymentDialogOpen(false);
    setFormData({
      processDate: today,
      amount: null,
      notes: '',
    });
  };

  return (
    <>
      <Button
        className="text-xs bg-[rgb(255,103,57)] text-white border-[rgb(255,103,57)] hover:bg-[rgb(230,93,47)] hover:border-[rgb(230,93,47)]"
        onClick={() => setPaymentDialogOpen(true)}
      >
        결제 입력
      </Button>
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>결제 입력</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="processDate" className="text-sm font-medium">
                처리일자
              </label>
              <Input
                id="processDate"
                type="text"
                value={format(today, 'yyyy-MM-dd')}
                readOnly
                tabIndex={-1}
                className="text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                결제금액 <span className="text-red-500">*</span>
              </label>
              <Input
                id="amount"
                type="text"
                placeholder="결제금액을 입력해주세요"
                value={formData.amount?.toLocaleString('ko-KR') || ''}
                onChange={handleAmountChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">
                비고
              </label>
              <Textarea
                id="notes"
                placeholder="비고사항을 입력해주세요"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button
              className="bg-[rgb(255,103,57)] text-white border-[rgb(255,103,57)] hover:bg-[rgb(230,93,47)] hover:border-[rgb(230,93,47)]"
              onClick={handleSubmit}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
