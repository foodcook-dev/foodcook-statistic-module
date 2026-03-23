import { useMemo, useEffect, useCallback, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { FilterField } from '@/types/filter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FilterValues {
  [key: string]: string;
}

interface FilterProps {
  fields: FilterField[];
  onFilter: (values: FilterValues) => void;
  onReset?: () => void;
}

export function Filter({ fields, onFilter, onReset }: FilterProps) {
  const defaultValues = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ''])),
    [fields],
  );

  const [values, setValues] = useState<FilterValues>(defaultValues);

  // 활성화된 필터 개수 계산
  const activeFilterCount = useMemo(() => {
    return Object.entries(values).filter(
      ([key, value]) => value !== '' && value !== defaultValues[key],
    ).length;
  }, [values, defaultValues]);

  // 필터가 기본값과 다른지 확인
  const hasActiveFilters = activeFilterCount > 0;

  useEffect(() => {
    onFilter(values);
  }, [values]);

  const handleChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setValues(defaultValues);
    onReset?.();
  }, [defaultValues, onReset]);

  return (
    <div className="bg-foreground/80 rounded-lg px-5 py-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          {fields.map((field) => {
            const isActive = values[field.name] !== '' && values[field.name] !== field.defaultValue;

            return (
              <div key={field.name} className="flex items-center gap-2.5">
                <label
                  htmlFor={`filter-${field.name}`}
                  className="text-contrast text-sm font-semibold whitespace-nowrap"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <Select
                    value={values[field.name]}
                    onValueChange={(value) => handleChange(field.name, value)}
                  >
                    <SelectTrigger
                      id={`filter-${field.name}`}
                      className={`border-border bg-background h-9 min-w-[140px] transition-all ${
                        isActive ? 'border-primary ring-primary/20 ring-1' : ''
                      }`}
                    >
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <span className="text-muted-foreground text-xs">{activeFilterCount}개 필터 적용됨</span>
          )}
          <Button onClick={handleReset} variant="outline" disabled={!hasActiveFilters}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
