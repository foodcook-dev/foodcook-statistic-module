import { useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface SectionCardProps {
  title: string;
  defaultOpen?: boolean;
  hasError?: boolean;
  children: React.ReactNode;
}

export function SectionCard({ title, children, defaultOpen = true, hasError }: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-border bg-foreground flex w-full flex-col rounded-md border px-6 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <p className="text-contrast text-lg font-bold">{title}</p>
          {hasError && (
            <span className="text-xs font-medium text-red-500">일부 항목에 오류가 있습니다.</span>
          )}
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
          <ChevronUp className="text-muted-foreground h-5 w-5" />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 flex flex-col gap-4">
            <hr className="border-border" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
