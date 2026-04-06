import { Inbox } from 'lucide-react';

export default function EmptyTab({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border from-muted/30 relative flex h-100 flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-dashed bg-gradient-to-b to-transparent px-6">
      <div className="relative flex flex-col items-center gap-3">
        <div className="border-border flex h-10 w-10 items-center justify-center rounded-full border">
          <Inbox className="text-contrast/70 h-4 w-4" strokeWidth={1.5} />
        </div>

        <p className="text-contrast/70 text-center text-sm font-medium tracking-wide">{message}</p>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
