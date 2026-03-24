import { useRef, useState, useCallback } from 'react';
import { Loader2, X, FileText, UploadCloud } from 'lucide-react';
import { cn } from '@/utils/common';

const ACCEPTED = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE_MB = 10;

interface BusinessLicenseUploadProps {
  onChange: (file: File | null) => void;
  error?: string;
  isLoading?: boolean;
}

type UploadedFile =
  | { type: 'image'; file: File; previewUrl: string }
  | { type: 'image-url'; previewUrl: string }
  | { type: 'pdf'; file: File };

interface BusinessLicenseUploadProps {
  onChange: (file: File | null) => void;
  error?: string;
  isLoading?: boolean;
  initialUrl?: string;
}

export function BusinessLicenseUpload({
  onChange,
  error,
  isLoading,
  initialUrl,
}: BusinessLicenseUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // initialUrl이 있으면 미리보기 상태로 초기화
  const [uploaded, setUploaded] = useState<UploadedFile | null>(
    initialUrl ? { type: 'image-url', previewUrl: initialUrl } : null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setValidationError(null);

      if (!ACCEPTED.includes(file.type)) {
        setValidationError('JPG, PNG, PDF 파일만 업로드 가능합니다.');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidationError(`파일 크기는 ${MAX_SIZE_MB}MB 이하여야 합니다.`);
        return;
      }

      if (file.type === 'application/pdf') {
        setUploaded({ type: 'pdf', file });
      } else {
        const previewUrl = URL.createObjectURL(file);
        setUploaded({ type: 'image', file, previewUrl });
      }

      onChange(file);
    },
    [onChange],
  );

  const handleRemove = () => {
    if (uploaded?.type === 'image') URL.revokeObjectURL(uploaded.previewUrl);
    setUploaded(null);
    setValidationError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const displayError = validationError ?? error;

  // image-url 타입: URL 미리보기 (파일명/용량 없음)
  const imagePreview =
    uploaded?.type === 'image' || uploaded?.type === 'image-url' ? (
      <div className="bg-background border-border relative overflow-hidden rounded-lg border">
        <img
          src={uploaded.previewUrl}
          alt="사업자등록증 미리보기"
          className="bg-secondary h-32 w-full object-contain"
        />

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <span className="text-sm text-white">사업자등록증 인식 중...</span>
          </div>
        )}

        <div className="border-border flex items-center justify-between border-t px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
            {uploaded.type === 'image' ? (
              <>
                <span className="text-contrast truncate text-sm">{uploaded.file.name}</span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  ({(uploaded.file.size / 1024 / 1024).toFixed(1)}MB)
                </span>
              </>
            ) : (
              <>
                <span className="text-contrast truncate text-sm">등록된 사업자등록증</span>
                <a
                  href={uploaded.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/70 flex items-center text-[11px] font-medium"
                >
                  파일 보기
                </a>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isLoading}
            className="text-muted-foreground hover:text-contrast ml-2 shrink-0 rounded p-1 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    ) : null;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-sm leading-none font-medium">사업자등록증</label>

      {!uploaded ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-border flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'bg-background hover:bg-secondary',
            displayError && 'border-red-400',
          )}
        >
          <UploadCloud className="text-muted-foreground h-8 w-8" />
          <div className="flex flex-col gap-1 text-center">
            <p className="text-contrast/60 flex items-center text-sm">
              클릭하거나 파일을 여기로 드래그하세요. (JPG, PNG, PDF · 최대 {MAX_SIZE_MB}MB)
            </p>
            <p className="text-contrast text-sm">
              사업자등록증을 업로드하면 인식된 정보가 자동으로 입력됩니다.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      ) : uploaded.type === 'pdf' ? (
        <div className="bg-background border-border relative flex items-center gap-3 rounded-lg border px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-contrast truncate text-sm font-medium">{uploaded.file.name}</p>
            <p className="text-muted-foreground text-xs">
              PDF · {(uploaded.file.size / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isLoading}
            className="text-muted-foreground hover:text-contrast shrink-0 rounded p-1 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        imagePreview
      )}

      {displayError && <p className="text-xs text-red-500">{displayError}</p>}
    </div>
  );
}
