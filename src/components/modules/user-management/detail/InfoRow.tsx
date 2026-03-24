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
      <div className="text-contrast/70 w-[40%] py-[5px]">{label}</div>
      <div className="text-contrast py-[5px] font-medium">{value || fallback}</div>
    </div>
  );
}
