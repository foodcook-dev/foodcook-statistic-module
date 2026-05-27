export function InfoRow({
  label,
  value,
  fallback = '-',
  description,
}: {
  label: string;
  value?: string;
  fallback?: string;
  description?: string;
}) {
  return (
    <div className="flex">
      <div className="text-contrast/70 flex w-[40%] items-center gap-1 py-[4px]">
        <span>{label}</span>
        {description && (
          <div className="group relative inline-flex">
            <button
              type="button"
              className="text-contrast/50 group-hover:text-contrast flex h-4 w-4 items-center justify-center rounded-full transition-colors"
              aria-label="설명 보기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
            <div className="bg-background text-contrast border-contrast pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[400px] -translate-x-1/2 rounded-md border px-3 py-2 text-xs leading-relaxed whitespace-pre-line opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
              {description}
              <div className="border-t-contrast absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
            </div>
          </div>
        )}
      </div>
      <div className="text-contrast py-[4px] font-medium">{value || fallback}</div>
    </div>
  );
}
