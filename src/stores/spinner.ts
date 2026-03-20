import { create } from 'zustand';

interface SpinnerState {
  isLoading: boolean;
  message: string;
  setLoading: (loading: boolean, message?: string) => void;
}

const useSpinnerStore = create<SpinnerState>((set) => ({
  isLoading: false,
  message: '처리 중...',
  setLoading: (loading: boolean, message: string = '처리 중...') =>
    set({ isLoading: loading, message }),
}));

export default useSpinnerStore;
