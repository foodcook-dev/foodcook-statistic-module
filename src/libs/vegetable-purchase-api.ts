import { createInstance } from '@/libs/api';
import { PATH } from '@/constants/api-path';
import { ERP_BASE_URL } from '@/constants/api-path';

const API = createInstance(ERP_BASE_URL.Prod);

export const getAvailableDate = async (): Promise<any> => {
  const response = await API.get(PATH.api.getVegetableAvailableDate);
  return response.data;
};

export const getBatchVegetablePurchaseProductManual = async (
  estimated_delivery_date: string,
): Promise<any> => {
  const response = await API.get(PATH.api.getBatchVegetablePurchaseProductManual, {
    params: { estimated_delivery_date },
  });
  return response.data;
};

export const patchPurchase = async (data: any): Promise<any> => {
  const response = await API.patch(PATH.api.patchBatchVegetablePurchaseProductManual, data);
  return response.data;
};
