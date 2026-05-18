import { ERP_API } from '@/libs/api';
import { PATH } from '@/constants/api-path';
import { PartialRefundInfo, RequestPartialRefundInfo } from '@/types/partial-refund';

export const getPartialRefundInfo = async (orderId: string): Promise<PartialRefundInfo> => {
  const response = await ERP_API.get(PATH.api.getPartialRefundInfo(orderId));
  return response.data;
};

export const postPartialRefund = async (orderId: string, data: RequestPartialRefundInfo) => {
  const response = await ERP_API.post(PATH.api.postPartialRefund(orderId), data);
  return response.data;
};
