export default function Empty() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="border-border/60 flex h-12 w-12 items-center justify-center rounded-[10px] border">
        <svg
          width="24"
          height="24"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-contrast/60"
        >
          <rect
            x="2"
            y="4"
            width="14"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M2 7h14" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M6 10.5h6M6 12.5h4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-contrast text-xl font-bold">데이터가 없습니다</span>
        <span className="text-contrast text-sm">조건을 변경하거나 필터를 초기화해보세요</span>
      </div>
    </div>
  );
}
