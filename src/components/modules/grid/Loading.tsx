export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-3.5">
      <div className="relative h-8 w-8">
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '1.2s' }}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-border"
          />
          <path
            d="M16 3 A13 13 0 0 1 29 16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-foreground"
          />
        </svg>
      </div>
      <span className="text-contrast text-sm font-bold tracking-wide">불러오는 중</span>
    </div>
  );
}
