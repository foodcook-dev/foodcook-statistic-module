import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, FileText, Pencil } from 'lucide-react';
import { DAYS } from '@/constants/user-management/day';
import { InfoRow } from './InfoRow';
import dayjs from 'dayjs';

export function BranchItem({ companyId, branch }: { companyId: number; branch: any }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const formatDate = (iso: string) => dayjs(iso).format('YYYY년 MM월 DD일');
  const isAllDays = Object.keys(branch.delivery_available_days ?? {}).length === 0;

  return (
    <div className="bg-foreground overflow-hidden rounded-md">
      <div
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex min-w-0 flex-1 items-end gap-2">
          <span className="text-contrast text-[14px] font-medium">
            {branch.type === 'main' ? '본사' : '종사업장'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user-management/sales-company/${companyId}/branch/${branch.id}/edit`);
            }}
            className="text-contrast hover:text-contrast/50 border-border flex shrink-0 items-center gap-1 rounded-md border p-1 transition-colors"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <span className="text-contrast/70 text-[11px]">#{branch.allias}</span>
        </div>
        {branch.is_default && (
          <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[12px] font-medium">
            기본 배송지
          </span>
        )}
        {open ? (
          <ChevronUp className="text-contrast/40 h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronDown className="text-contrast/40 h-3.5 w-3.5 shrink-0" />
        )}
      </div>

      {open && (
        <div className="border-border border-t px-4 pt-2.5 pb-3 text-[12px]">
          <div className="flex items-center">
            <span className="text-contrast/70 w-[40%] py-[5px]">사업자등록증</span>
            {branch.cert_image ? (
              <a
                href={branch.cert_image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/70 flex items-center gap-1 py-[5px] text-[10px] font-medium transition-colors"
              >
                <FileText className="h-3 w-3" /> 파일 보기
              </a>
            ) : (
              <span className="text-contrast/40 py-[5px]">미등록</span>
            )}
          </div>
          <InfoRow label="사업자번호" value={branch.b_no} />
          <InfoRow label="주소" value={branch.address} />
          <InfoRow label="상세주소" value={branch.address_detail ?? ''} />
          <InfoRow label="배송 메모" value={branch.delivery_memo ?? ''} />
          <InfoRow label="출입문 비밀번호" value={branch.gate_password ?? ''} />
          <InfoRow label="등록일" value={branch.created_at && formatDate(branch.created_at)} />

          {branch.delivery_available_days !== null && (
            <div className="flex items-center py-[5px]">
              <p className="text-contrast/70 w-[40%]">배송 가능 요일</p>
              <div className="flex gap-1">
                {DAYS.map(({ id, name }) => {
                  const available = isAllDays
                    ? true
                    : (branch.delivery_available_days as Record<string, boolean>)?.[id];
                  return (
                    <span
                      key={id}
                      className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${
                        available
                          ? 'border-primary/10 bg-primary/10 text-primary'
                          : 'border-border bg-foreground text-contrast/40'
                      }`}
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
