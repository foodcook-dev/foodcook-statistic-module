import type { CellBase } from 'react-spreadsheet';

export type ExtendedCellBase = CellBase & {
  key?: string;
};

export type OrderApiResponse = {
  estimated_delivery_date: string;
  order_aggregation_period: string;
  table_data: ExtendedCellBase[][];
};
