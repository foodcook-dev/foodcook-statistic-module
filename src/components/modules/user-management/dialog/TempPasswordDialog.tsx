import { Copy } from 'lucide-react';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { showToastMessage } from '@/libs/toast-message';

interface TempPasswordData {
  user_id: string;
  plain_password: string;
  expires_at: string;
}

interface TempPasswordDialogProps {
  open: boolean;
  data: TempPasswordData | null;
  onClose: () => void;
}

export function TempPasswordDialog({ open, data, onClose }: TempPasswordDialogProps) {
  const handleCopy = (copyText: string) => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText);
    showToastMessage({ content: '클립보드에 복사되었습니다.' });
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>임시 비밀번호 발급 완료</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="bg-secondary rounded-md py-3 text-sm">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-contrast/60">사용자 아이디</span>
              <div className="flex items-center gap-2">
                <span className="text-contrast max-w-[300px] truncate font-medium tracking-widest">
                  {data.user_id}
                </span>
                <button
                  onClick={() => handleCopy(data.user_id)}
                  className="text-contrast/40 hover:text-contrast transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="border-border border-t" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-contrast/60">임시 비밀번호</span>
              <div className="flex items-center gap-2">
                <span className="text-contrast font-medium tracking-widest">
                  {data.plain_password}
                </span>
                <button
                  onClick={() => handleCopy(data.plain_password)}
                  className="text-contrast/40 hover:text-contrast transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="border-border border-t" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-contrast/60">만료 일시</span>
              <span className="text-contrast/80 text-sm">
                {dayjs(data.expires_at).format('YYYY.MM.DD HH:mm')}
              </span>
            </div>
          </div>

          <p className="text-contrast/80 text-xs">
            해당 비밀번호는 일회용이며, 만료 일시 이후에는 사용할 수 없습니다.
          </p>
        </div>

        <Button onClick={onClose} className="w-full">
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
}
