import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExcelDownloadButtonProps {
  onDownload: () => void;
  isDownloading: boolean;
  disabled?: boolean;
}

// 엑셀 다운로드 버튼 (다운로드 중에는 로딩 아이콘 + 비활성화, 컬럼 설정 초기화 버튼과 같은 스타일)
export function ExcelDownloadButton({
  onDownload,
  isDownloading,
  disabled,
}: ExcelDownloadButtonProps) {
  return (
    <Button
      onClick={onDownload}
      variant="outline"
      disabled={disabled || isDownloading}
      className="px-3 py-1 text-xs"
    >
      {isDownloading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      엑셀 다운로드
    </Button>
  );
}

export default ExcelDownloadButton;
