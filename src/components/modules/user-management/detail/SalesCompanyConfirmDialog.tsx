import { TriangleAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SalesCompanyDetailResponse } from '@/types/user-management';

interface SalesCompanyConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SalesCompanyDetailResponse;
  onConfirm: () => void;
}

/** 승인 시 종사업장 정보로 덮어써지는 항목 */
function ChangeRow({ label, current, next }: { label: string; current: string; next: string }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-2.5">
      <span className="text-contrast text-[12px] font-medium tracking-wide">{label}</span>
      <span className="text-contrast/40 text-[13px] line-through">{current || '-'}</span>
      <div className="flex items-start gap-1.5">
        <span className="text-primary text-[13px] font-semibold">{next || '-'}</span>
      </div>
    </div>
  );
}

export function SalesCompanyConfirmDialog({
  open,
  onOpenChange,
  data,
  onConfirm,
}: SalesCompanyConfirmDialogProps) {
  const subBusiness = data.sub_business_info;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* 공용 다이얼로그의 top-[30%]를 덮어 세로 중앙 정렬 */}
      <AlertDialogContent className="top-1/2">
        <AlertDialogHeader>
          <AlertDialogTitle>사업자 승인</AlertDialogTitle>
          <AlertDialogDescription>사업자 승인을 진행하시겠습니까?</AlertDialogDescription>
        </AlertDialogHeader>

        {subBusiness && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-2.5">
              <TriangleAlert className="h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-contrast/80 text-[12px] leading-relaxed">
                이 사업자는 종사업장(일련번호{' '}
                <span className="text-contrast font-semibold">{subBusiness.serial_number}</span>
                )으로 등록되어 있습니다.
                <br />
                승인 시 <span className="text-contrast font-semibold">상호명과 주소</span>가 아래
                종사업장 정보로 변경됩니다.
              </p>
            </div>

            <div className="border-border divide-border divide-y rounded-md border">
              <ChangeRow label="상호명" current={data.b_nm} next={subBusiness.b_nm} />
              <ChangeRow label="주소" current={data.address} next={subBusiness.address} />
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>승인하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
