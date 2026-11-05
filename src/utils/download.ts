// Content-Disposition 헤더에서 파일명 추출 (filename*=UTF-8''... 우선, 없으면 filename="...")
export const getFilenameFromDisposition = (disposition?: string | null): string | null => {
  if (!disposition) return null;

  const encoded = disposition.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i);
  if (encoded?.[1]) {
    try {
      return decodeURIComponent(encoded[1].trim().replace(/^"|"$/g, ''));
    } catch {
      // 디코딩 실패 시 일반 filename으로 넘어간다.
    }
  }

  const plain = disposition.match(/filename\s*=\s*"?([^";]+)"?/i);
  return plain?.[1]?.trim() ?? null;
};

// Blob을 파일로 저장 (임시 링크를 클릭시킨 뒤 바로 정리)
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
