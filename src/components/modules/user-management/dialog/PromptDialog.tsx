import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PromptDialogProps {
  open: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function PromptDialog({ open, onConfirm, onCancel }: PromptDialogProps) {
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    onCancel();
    setValue('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>임시 비밀번호 발급</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p className="text-contrast/70 text-sm">발급 사유를 입력해주세요.</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm leading-none font-medium">
              사유
              <span className="text-destructive ml-1 text-red-500">*</span>
            </label>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="예) 사용자 요청으로 인한 접속 확인"
              className="h-24 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!value.trim()}>
            발급
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
