import createParams from '@/utils/createParams';
import {
  IPaymentInfo,
  IRefundRequest,
  IPaymentInfoResponse,
  IVirtualAccountInfo,
  PaymentPassInfoParam,
  IMyPaymentResponse,
  IMyPaymentParams,
} from '@/types/payment';
import { FetchError } from '@/types/types';

export const postPaymentInfo = async (data: IPaymentInfo) => {
  try {
    const response = await fetch(`/api/payment/payInfo`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((data) => data.json());

    if (response.statusCode === 400 || response.statusCode === 401) {
      return response.message;
    }

    return response.data.pendingPaymentInfo;
  } catch (error) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
  }
};

export const postPaymentCancel = async (id: string) => {
  try {
    const response = await fetch(`/api/payment/cancel?id=${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
  }
};

export const getPaymentHistory = async (
  data: IMyPaymentParams,
  signal?: AbortSignal,
): Promise<IMyPaymentResponse> => {
  const params = createParams(data);

  const response = await fetch(`/api/payment/history?${params}`, {
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

  const res = await response.json();

  return { count: res.data.totalItemCount, item: res.data.userPaymentsHistory };
};

export const getAccountInfo = async (
  id: number,
): Promise<IVirtualAccountInfo> => {
  const response = await fetch(`/api/payment/accountInfo?id=${id}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('무통장 정보 조회 오류!');
  }

  const { data } = await response.json();

  return data.virtualAccountDepositDetails.virtualAccountPaymentInfo;
};

export const postPassPaymentInfo = async (
  data: PaymentPassInfoParam,
): Promise<IPaymentInfoResponse> => {
  try {
    const response = await fetch(`/api/payment/pass`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();
    return responseData.data.pendingPaymentInfo;
  } catch (error) {
    console.error('패스권 결제 정보 생성 오류', error);
    throw error;
  }
};

export const postRefund = async (id: number | string, data: IRefundRequest) => {
  const response = await fetch(`/api/payment/refund?id=${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((data) => data.json());

  return response;
};

export const postPassPaymentClassWithPass = async (data: IPaymentInfo) => {
  try {
    const response = await fetch(`/api/payment/class-with-pass`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('패스권으로 클래스 결제 오류 ', error);
    throw error;
  }
};
