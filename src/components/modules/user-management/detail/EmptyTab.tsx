export default function EmptyTab({ message }: { message: string }) {
  return (
    <div className="text-contrast/40 border-border flex h-40 items-center justify-center rounded-xl border text-sm">
      {message}
    </div>
  );
}
