type VerificationBadgeProps = {
  verified: boolean;
  label: string;
  verifiedColor: 'emerald' | 'blue';
};

export function VerificationBadge({ verified, label, verifiedColor }: VerificationBadgeProps) {
  const colorMap = {
    emerald: {
      verified: 'bg-background text-emerald-500 ring-emerald-500/15',
      dot: 'bg-emerald-400',
    },
    blue: {
      verified: 'bg-background text-blue-500 ring-blue-500/15',
      dot: 'bg-blue-400',
    },
  };

  const colors = colorMap[verifiedColor];

  return verified ? (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ring-1 ${colors.verified}`}
    >
      {label} 완료
    </span>
  ) : (
    <span className="bg-background text-contrast/50 ring-contrast/10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1">
      {label} 미완료
    </span>
  );
}
