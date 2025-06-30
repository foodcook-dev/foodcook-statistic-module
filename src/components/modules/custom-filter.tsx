import { useState, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import { IDoesFilterPassParams } from 'ag-grid-community';
import { Button } from '@/components/atoms/button';

interface CustomFilterState {
  selectedValues: Array<string>;
}

interface CustomFilterProps {
  api: any;
  onModelChange: (model: CustomFilterState | null) => void;
  getValue: (node: any) => any;
  model?: CustomFilterState | null;
}

const CustomFilter = (props: CustomFilterProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(props.model?.selectedValues || []);
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);

  useEffect(() => {
    const values: string[] = [];
    props.api.forEachNode((node: any) => {
      const value = props.getValue(node);
      if (value !== null && value !== undefined && value !== '' && !values.includes(value)) {
        values.push(String(value));
      }
    });
    setUniqueValues(values.sort());
  }, [props.api, props.getValue]);

  // props.model이 변경될 때 selectedValues 업데이트
  useEffect(() => {
    setSelectedValues(props.model?.selectedValues || []);
  }, [props.model]);

  const doesFilterPass = (params: IDoesFilterPassParams) => {
    // 아무것도 선택하지 않았거나 모든 것을 선택했으면 모든 행을 표시
    if (selectedValues.length === 0 || selectedValues.length === uniqueValues.length) {
      return true;
    }
    const value = String(props.getValue(params.node));
    return selectedValues.includes(value);
  };

  // useGridFilter 훅 사용
  useGridFilter({
    doesFilterPass,
  });

  const updateModel = (newSelectedValues: string[]) => {
    setSelectedValues(newSelectedValues);

    // 모델이 비어있거나 모든 값이 선택된 경우 null 반환 (필터 비활성화)
    if (newSelectedValues.length === 0 || newSelectedValues.length === uniqueValues.length) {
      props.onModelChange(null);
    } else {
      props.onModelChange({ selectedValues: [...newSelectedValues] });
    }
  };

  const handleValueChange = (value: string, checked: boolean) => {
    let newSelectedValues: string[];
    if (checked) {
      newSelectedValues = [...selectedValues, value];
    } else {
      newSelectedValues = selectedValues.filter((v) => v !== value);
    }

    updateModel(newSelectedValues);
  };

  const handleSelectAll = () => {
    let newSelectedValues: string[];
    if (selectedValues.length === uniqueValues.length) {
      newSelectedValues = [];
    } else {
      newSelectedValues = [...uniqueValues];
    }

    updateModel(newSelectedValues);
  };

  const handleClear = () => {
    updateModel([]);
  };

  return (
    <div className="p-3 min-w-[200px] max-h-[300px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
      <div className="mb-3 pb-2 border-b border-gray-200">
        <div className="flex gap-2">
          <Button
            onClick={handleSelectAll}
            className="text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {selectedValues.length === uniqueValues.length ? '전체 해제' : '전체 선택'}
          </Button>
          <Button
            onClick={handleClear}
            className="text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            초기화
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {uniqueValues.map((value) => (
          <label
            key={value}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(value)}
              onChange={(e) => handleValueChange(value, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">{value}</span>
          </label>
        ))}
      </div>

      {uniqueValues.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4">데이터가 없습니다</div>
      )}
    </div>
  );
};

CustomFilter.displayName = 'CustomFilter';

export default CustomFilter;
