import { ERP_API } from '@/libs/api';
import { PATH } from '@/constants/api-path';

export const getAvailableDate = async (): Promise<any> => {
  const response = await ERP_API.get(PATH.api.getVegetableAvailableDate);
  return response.data;
};

export const getBatchVegetablePurchaseProductManual = async (
  estimated_delivery_date: string,
): Promise<any> => {
  const response = await ERP_API.get(PATH.api.getBatchVegetablePurchaseProductManual, {
    params: { estimated_delivery_date },
  });
  return response.data;
};

export const patchPurchase = async (data: any): Promise<any> => {
  const response = await ERP_API.patch(PATH.api.patchBatchVegetablePurchaseProductManual, data);
  return response.data;
};
