export function InfoRow({
  label,
  value,
  fallback = '-',
}: {
  label: string;
  value?: string;
  fallback?: string;
}) {
  return (
    <div className="flex">
      <div className="text-contrast/70 w-[40%] py-[4px]">{label}</div>
      <div className="text-contrast py-[4px] font-medium">{value || fallback}</div>
    </div>
  );
}
