import { Button } from '@/components/ui/button';

interface FilterResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

// 그리드에 걸린 모든 필터를 해제하는 버튼 (컬럼 설정 초기화 버튼과 같은 스타일)
export function FilterResetButton({ onReset, disabled }: FilterResetButtonProps) {
  return (
    <Button onClick={onReset} variant="outline" disabled={disabled} className="px-3 py-1 text-xs">
      필터 초기화
    </Button>
  );
}

export default FilterResetButton;
