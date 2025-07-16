import useSpinnerStore from '@/store/spinner';

export default function Spinner() {
  const { isLoading, message } = useSpinnerStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center z-50 transition-all duration-300 pt-[30vh]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-white/20 min-w-[280px] animate-in fade-in-0 zoom-in-95 duration-300 h-fit">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-blue-500/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
        </div>

        <div className="text-center">
          <span className="text-gray-800 font-semibold text-lg block">{message}</span>
          <span className="text-gray-500 text-sm mt-1 block">잠시만 기다려주세요...</span>
        </div>

        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
