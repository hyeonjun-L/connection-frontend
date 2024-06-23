import { cookies } from 'next/headers';
import { cache } from 'react';
import createParams from '@/utils/createParams';
import {
  IPassInfoForIdData,
  IgetPassFunction,
  IpassData,
  IresponsePassData,
  passSituation,
  userPassList,
} from '@/types/pass';
import { FetchError } from '@/types/types';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const getLecturerPassList = async (
  lecturerId: string,
): Promise<undefined | IpassData[]> => {
  try {
    const response = await fetch(
      `${END_POINT}/passes/lecturers/${lecturerId}`,
      {
        cache: 'no-store',
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw new Error(`강사 패스권 목록 불러오기: ${error.status} ${error}`);
    }

    const resData = await response.json();

    return resData.data.passList;
  } catch (error) {
    console.error(error);
  }
};

export const getIssuedPassList = async (
  data: IgetPassFunction,
  type: 'lecturer' | 'user',
): Promise<IresponsePassData> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get(
    type === 'lecturer' ? 'lecturerAccessToken' : 'userAccessToken',
  )?.value;
  const params = createParams(data);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${END_POINT}/passes/issued?${params}`, {
    cache: 'no-store',
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error: FetchError = new Error(errorData.message || '');
    error.status = response.status;
    throw error;
  }

  const resData = await response.json();

  const { passList: item, totalItemCount } = resData?.data ?? {
    totalItemCount: 0,
    passList: [],
  };

  return { item, count: totalItemCount };
};

export const getPassInfoForId = cache(
  async (passId: string | number): Promise<IPassInfoForIdData | undefined> => {
    try {
      const cookieStore = cookies();
      const authorization = cookieStore.get('userAccessToken')?.value;

      const headers: Record<string, string> = authorization
        ? {
            Authorization: `Bearer ${authorization}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' };

      const response = await fetch(`${END_POINT}/passes/${passId}`, {
        method: 'GET',
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error: FetchError = new Error(errorData.message || '');
        error.status = response.status;
        throw new Error(`패스권 조회 오류: ${error.status} ${error}`);
      }

      const resData = await response.json();

      return resData.data.pass;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getSalesStatusPass = async (
  passId: number,
): Promise<passSituation[]> => {
  try {
    const cookieStore = cookies();
    const authorization = cookieStore.get('lecturerAccessToken')?.value;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${authorization}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${END_POINT}/lecturer-payments/passes/${passId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw new Error(`패스권 조회 오류: ${error.status} ${error}`);
    }
    const resData = await response.json();

    return resData.data?.passSituationList ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserPassList = async (
  take: number,
  lastItemId?: number,
): Promise<{ totalItemCount: number; userPassList: userPassList[] }> => {
  try {
    const cookieStore = cookies();
    const authorization = cookieStore.get('userAccessToken')?.value;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${authorization}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${END_POINT}/user-passes?take=${take}${
        lastItemId ? `&lastItemId=${lastItemId}` : ''
      }`,
      {
        method: 'GET',
        credentials: 'include',
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw new Error(
        `유저 보유중인 패스권 조회 오류: ${error.status} ${error}`,
      );
    }

    const resData = await response.json();

    return resData.data.userPassList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLecturesPassList = async (
  lectureId: number,
): Promise<userPassList[]> => {
  try {
    const cookieStore = cookies();
    const authorization = cookieStore.get('userAccessToken')?.value;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${authorization}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${END_POINT}/user-passes/lectures/${lectureId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw new Error(
        `유저 강의에서 보유중인 패스권 조회 오류: ${error.status} ${error}`,
      );
    }

    const resData = await response.json();

    return resData.data.usablePassList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
