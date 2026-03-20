import useSpinnerStore from '@/stores/spinner';

export default function Spinner() {
  const { isLoading, message } = useSpinnerStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/40 pt-[30vh] backdrop-blur-sm transition-all duration-300">
      <div className="animate-in fade-in-0 zoom-in-95 flex h-fit min-w-[280px] flex-col items-center gap-4 rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-md duration-300">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400"></div>
          <div className="absolute top-2 left-2 h-8 w-8 animate-pulse rounded-full bg-blue-500/20"></div>
          <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-blue-500"></div>
        </div>

        <div className="text-center">
          <span className="block text-lg font-semibold text-gray-800">{message}</span>
          <span className="mt-1 block text-sm text-gray-500">잠시만 기다려주세요...</span>
        </div>

        <div className="flex gap-1">
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
