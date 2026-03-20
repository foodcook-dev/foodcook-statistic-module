interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const barSizeClasses = {
    sm: 'w-0.5 h-3',
    md: 'w-1 h-4',
    lg: 'w-1 h-6',
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1',
    lg: 'gap-2',
  };

  return (
    <div className={`flex h-[32px] items-center justify-center ${className}`}>
      <div className={`flex items-end ${gapClasses[size]}`}>
        <div
          className={`${barSizeClasses[size]} animate-pulse rounded bg-gray-400 dark:bg-gray-600`}
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        ></div>
        <div
          className={`${barSizeClasses[size]} animate-pulse rounded bg-gray-400 dark:bg-gray-600`}
          style={{ animationDelay: '200ms', animationDuration: '1s' }}
        ></div>
        <div
          className={`${barSizeClasses[size]} animate-pulse rounded bg-gray-400 dark:bg-gray-600`}
          style={{ animationDelay: '400ms', animationDuration: '1s' }}
        ></div>
        <div
          className={`${barSizeClasses[size]} animate-pulse rounded bg-gray-400 dark:bg-gray-600`}
          style={{ animationDelay: '600ms', animationDuration: '1s' }}
        ></div>
      </div>
    </div>
  );
}
