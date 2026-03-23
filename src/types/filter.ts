interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  name: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}
