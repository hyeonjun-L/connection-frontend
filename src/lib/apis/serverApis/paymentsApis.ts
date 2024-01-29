import { cookies } from 'next/headers';
import {
  IPaymentConfirmRequest,
  IPaymentConfirmResponse,
  IReceiptResponse,
} from '@/types/payment';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const patchPaymentConfirm = async (
  data: IPaymentConfirmRequest,
): Promise<IPaymentConfirmResponse | Error> => {
  const cookieStore = cookies();
  const token = cookieStore.get('userAccessToken')?.value;

  if (!token) throw new Error(`유저 토큰 에러!`);

  try {
    const response = await fetch(END_POINT + '/payments/toss/confirm', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((data) => data.json());

    if (response.statusCode !== 200) {
      throw new Error(`결제 승인 오류: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error('결제 승인 오류', error);
    throw error;
  }
};

export const getReceipt = async (
  orderId: string,
): Promise<IReceiptResponse | Error> => {
  const cookieStore = cookies();
  const token = cookieStore.get('userAccessToken')?.value;

  if (!token) throw new Error(`유저 토큰 에러!`);

  try {
    const response = await fetch(
      END_POINT + `/user-payments/history/${orderId}`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((data) => data.json());
    console.log(response.data.receipt);
    return response.data.receipt;
  } catch (error) {
    console.error('영수증 요청 오류', error);
    throw error;
  }
};
