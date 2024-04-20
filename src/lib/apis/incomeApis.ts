import createParams from '@/utils/createParams';
import { IIncomeHistoryParams, IIncomeHistoryResponse } from '@/types/payment';
import { FetchError } from '@/types/types';

export const getIncomeStatics = async (type: 'MONTHLY' | 'DAILY') => {
  const query =
    type === 'DAILY'
      ? `statisticsType=${type}&date=${new Date()}`
      : `statisticsType=${type}`;

  try {
    const response = await fetch(`/api/income/stat?${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => data.json());

    return response.data.revenueStatistics;
  } catch (error) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
  }
};

export const getRecentAccount = async () => {
  try {
    const response = await fetch(`/api/income/recent-account`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => data.json());

    return response.data.lecturerRecentBankAccount;
  } catch (error) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
  }
};

export const getTotalIncome = async (
  startDate: Date,
  endDate: Date,
  productType: string,
  lectureId?: number,
) => {
  const startISODate = startDate.toISOString().split('T')[0];
  const endISODate = endDate.toISOString().split('T')[0];
  const query = `startDate=${startISODate}&endDate=${endISODate}&productType=${productType}${
    lectureId ? `&lectureId=${lectureId}` : ''
  }`;

  const response = await fetch(`/api/income/total-income?${query}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json());

  return response.data.totalRevenue;
};

export const getIncomeHistory = async (
  data: IIncomeHistoryParams,
  signal?: AbortSignal,
): Promise<IIncomeHistoryResponse> => {
  const params = createParams(data);

  const response = await fetch(`/api/income/history?${params}`, {
    method: 'GET',
    credentials: 'include',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error: FetchError = new Error(errorData.message || '');
    error.status = response.status;
    throw error;
  }

  const resData = await response.json();

  return {
    count: resData.data.totalItemCount,
    item: resData.data?.lecturerPaymentList ?? [],
  };
};
