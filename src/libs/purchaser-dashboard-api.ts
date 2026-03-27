import { API } from '@/libs/api';
import { PATH } from '@/constants/api-path';

export const getIntegratedCompany = async (params: {
  startDate: string;
  endDate: string;
  filter: string;
  sort: string;
  page: number;
  pageSize: number;
}): Promise<any> => {
  const response = await API.get(PATH.api.getIntegratedCompany, {
    params: {
      start_date: params.startDate,
      end_date: params.endDate,
      filter: params.filter,
      sort: params.sort,
      page: params.page,
      size: params.pageSize,
    },
  });

  return response.data;
};

export const getCompany = async (type: 'direct' | 'consignment'): Promise<any> => {
  const endpoint = type === 'direct' ? PATH.api.getBuyCompanyList : PATH.api.getPartnerCompanyList;
  const response = await API.get(endpoint);
  return response.data;
};

export const getBuyCompany = async (companyId: string): Promise<any> => {
  const response = await API.get(PATH.api.getBuyCompany(companyId));
  return response.data;
};

export const getBuyCompanyDetails = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    startDate: string;
    endDate: string;
    filter: string;
    page: number;
    pageSize: number;
  };
}): Promise<any> => {
  const response = await API.get(PATH.api.getBuyCompany(companyId) + 'details/', {
    params: {
      start_date: params.startDate,
      end_date: params.endDate,
      filter: params.filter,
      page: params.page,
      size: params.pageSize,
    },
  });

  return response.data;
};

export const postBuyCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    amount: number;
    date: string;
    note: string;
  };
}): Promise<any> => {
  const response = await API.post(PATH.api.buyCompanyPayment(companyId), {
    payment_date: params.date,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

export const patchBuyCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    id: string;
    amount: number;
    note: string;
  };
}): Promise<any> => {
  const response = await API.patch(PATH.api.buyCompanyPayment(companyId), {
    detail_id: params.id,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

export const deleteBuyCompanyPayment = async ({
  companyId,
  id,
}: {
  companyId: string;
  id: string;
}): Promise<any> => {
  const response = await API.delete(PATH.api.buyCompanyPayment(companyId), {
    params: {
      detail_id: id,
    },
  });
  return response.data;
};

export const getPartnerCompany = async (companyId: string): Promise<any> => {
  const response = await API.get(PATH.api.getPartnerCompany(companyId));
  return response.data;
};

export const getPartnerCompanyDetails = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    startDate: string;
    endDate: string;
    filter: string;
    page: number;
    pageSize: number;
  };
}): Promise<any> => {
  const response = await API.get(PATH.api.getPartnerCompany(companyId) + 'details/', {
    params: {
      start_date: params.startDate,
      end_date: params.endDate,
      filter: params.filter,
      page: params.page,
      size: params.pageSize,
    },
  });

  return response.data;
};

export const postPartnerCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    amount: number;
    date: string;
    note: string;
  };
}): Promise<any> => {
  const response = await API.post(PATH.api.partnerCompanyPayment(companyId), {
    payment_date: params.date,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

export const patchPartnerCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    id: string;
    amount: number;
    note: string;
  };
}): Promise<any> => {
  const response = await API.patch(PATH.api.partnerCompanyPayment(companyId), {
    detail_id: params.id,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

export const deletePartnerCompanyPayment = async ({
  companyId,
  id,
}: {
  companyId: string;
  id: string;
}): Promise<any> => {
  const response = await API.delete(PATH.api.partnerCompanyPayment(companyId), {
    params: {
      detail_id: id,
    },
  });
  return response.data;
};

export const getLog = async ({
  type,
  companyId,
  detailId,
}: {
  type: 'direct' | 'consignment';
  companyId: string;
  detailId: string;
}): Promise<any> => {
  const endpoint = type === 'direct' ? PATH.api.getBuyLog : PATH.api.getPartnerLog;

  const response = await API.get(endpoint, {
    params: {
      company_id: companyId,
      detail_id: detailId,
    },
  });

  return response.data;
};
