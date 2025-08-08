import { useState, useMemo, useCallback } from 'react';
import { useGridFilter } from 'ag-grid-react';
import { IDoesFilterPassParams, IRowNode } from 'ag-grid-community';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/checkbox';

interface SelectFilterState {
  filterType: 'set';
  values: string[];
}

interface GridApi {
  forEachNode: (callback: (node: IRowNode) => void) => void;
}

interface SelectFilterProps {
  api: GridApi;
  type: 'radio' | 'checkbox';
  structure: Array<{ key: string; label: string }>;
  onModelChange: (model: SelectFilterState | null) => void;
  getValue: (node: IRowNode) => unknown;
}

const useFilterList = (
  api: GridApi,
  getValue: (node: IRowNode) => unknown,
  structure: Array<{ key: string; label: string }>,
) => {
  return useMemo(() => {
    if (structure) {
      return structure;
    }

    const values: Array<{ key: string; label: string }> = [];
    const seenKeys = new Set<string>();

    api.forEachNode((node: IRowNode) => {
      const value = getValue(node);
      const stringValue = String(value);

      if (value !== null && value !== undefined && value !== '' && !seenKeys.has(stringValue)) {
        seenKeys.add(stringValue);
        values.push({ key: stringValue, label: stringValue });
      }
    });

    return values.sort((a, b) => a.label.localeCompare(b.label));
  }, [api, getValue, structure]);
};

const useFilterState = (type: 'radio' | 'checkbox') => {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('');

  const resetState = useCallback(() => {
    if (type === 'radio') {
      setSelectedRadioValue('');
    } else {
      setSelectedData([]);
    }
  }, [type]);

  return {
    selectedData,
    selectedRadioValue,
    setSelectedData,
    setSelectedRadioValue,
    resetState,
  };
};

const SelectFilter = ({ api, type, structure, onModelChange, getValue }: SelectFilterProps) => {
  const filterList = useFilterList(api, getValue, structure);
  const { selectedData, selectedRadioValue, setSelectedData, resetState } = useFilterState(type);

  const doesFilterPass = useCallback(
    (params: IDoesFilterPassParams) => {
      const nodeValue = String(getValue(params.node));

      if (type === 'radio') {
        return !selectedRadioValue || nodeValue === selectedRadioValue;
      }

      return (
        selectedData.length === 0 ||
        selectedData.length === filterList.length ||
        selectedData.includes(nodeValue)
      );
    },
    [type, selectedRadioValue, selectedData, filterList.length, getValue],
  );

  useGridFilter({ doesFilterPass });

  const updateModel = useCallback(
    (values: string[]) => {
      const model = values.length > 0 ? { filterType: 'set' as const, values } : null;
      onModelChange(model);
    },
    [onModelChange],
  );

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      const newSelectedValues = checked
        ? [...selectedData, value]
        : selectedData.filter((v) => v !== value);

      setSelectedData(newSelectedValues);
      updateModel(newSelectedValues);
    },
    [selectedData, setSelectedData, updateModel],
  );

  // const handleRadioChange = useCallback(
  //   (value: string) => {
  //     setSelectedRadioValue(value);
  //     updateModel(value ? [value] : []);
  //   },
  //   [setSelectedRadioValue, updateModel],
  // );

  const handleClear = useCallback(() => {
    resetState();
    updateModel([]);
  }, [resetState, updateModel]);

  const renderFilterOptions = useMemo(() => {
    // if (type === 'radio') {
    //   return <></>;
    // }

    return filterList.map((item) => (
      <label
        key={item.key}
        className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-gray-50"
      >
        <Checkbox
          checked={selectedData.includes(item.key)}
          onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
          className="h-4 w-4"
        />
        <span className="text-xs text-gray-900">{item.label}</span>
      </label>
    ));
  }, [type, filterList, selectedData, handleCheckboxChange]);

  return (
    <div className="min-w-[200px] overflow-y-auto bg-white p-2">
      <div className="max-h-[200px] space-y-2 overflow-auto">{renderFilterOptions}</div>
      <div className="mt-2 border-t border-gray-200 pt-2">
        <div className="flex justify-end">
          <Button
            onClick={handleClear}
            className="h-[30px] rounded bg-gray-500 text-xs text-white hover:bg-gray-600"
          >
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
};

SelectFilter.displayName = 'SelectFilter';

export default SelectFilter;
