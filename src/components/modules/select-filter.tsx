import { useState, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import { IDoesFilterPassParams } from 'ag-grid-community';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/checkbox';

type SelectFilterState = {
  selectedValues: Array<string>;
};

type SelectFilterProps = {
  api: any;
  onModelChange: (model: SelectFilterState | null) => void;
  getValue: (node: any) => any;
  model?: SelectFilterState | null;
};

const SelectFilter = (props: SelectFilterProps) => {
  const [selectedData, setSelectedData] = useState<string[]>(props.model?.selectedValues || []);
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

  useEffect(() => {
    setSelectedData(props.model?.selectedValues || []);
  }, [props.model]);

  const doesFilterPass = (params: IDoesFilterPassParams) => {
    if (selectedData.length === 0 || selectedData.length === uniqueValues.length) {
      return true;
    }
    const value = String(props.getValue(params.node));
    return selectedData.includes(value);
  };

  useGridFilter({
    doesFilterPass,
  });

  const updateModel = (newSelectedValues: string[]) => {
    setSelectedData(newSelectedValues);

    if (newSelectedValues.length === 0) {
      props.onModelChange(null);
    } else {
      props.onModelChange({ selectedValues: [...newSelectedValues] });
    }
  };

  const handleChange = (value: string, checked: boolean) => {
    let newSelectedValues: string[];
    if (checked) {
      newSelectedValues = [...selectedData, value];
    } else {
      newSelectedValues = selectedData.filter((v) => v !== value);
    }
    updateModel(newSelectedValues);
  };

  const handleClear = () => {
    updateModel([]);
  };

  return (
    <div className="p-[8px] min-w-[200px] max-h-[300px] overflow-y-auto bg-white">
      <div className="space-y-2">
        {uniqueValues.map((value) => (
          <label
            key={value}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <Checkbox
              checked={selectedData.includes(value)}
              onCheckedChange={(checked) => handleChange(value, checked as boolean)}
              className="w-4 h-4"
            />
            <span className="text-xs text-gray-900">{value}</span>
          </label>
        ))}
      </div>
      <div className="mt-[8px] pt-[8px] border-t border-gray-200">
        <div className="flex justify-end">
          <Button
            onClick={handleClear}
            className="h-[30px] text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            초기화
          </Button>
        </div>
      </div>

      {uniqueValues.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4">
          필터를 적용 할 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

SelectFilter.displayName = 'SelectFilter';

export default SelectFilter;
