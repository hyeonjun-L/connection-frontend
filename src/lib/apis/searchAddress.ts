import { AddressData, RoadAddrPoint } from '@/types/address';
import { FetchError } from '@/types/types';

export const searchAddress = async (
  keyword: string,
  page: number,
  signal?: AbortSignal,
) => {
  try {
    const response = await fetch(
      `/api/map/address?keyword=${encodeURIComponent(keyword)}&page=${page}`,
      { signal },
    );

    if (!response.ok) throw new Error('Network response was not ok');

    const data: AddressData = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAddressPoint = async (
  query: string,
): Promise<RoadAddrPoint> => {
  try {
    const response = await fetch(`/api/map/point?query=${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    return data.response;
  } catch (error) {
    console.error('주소 좌표값 조회 오류', error);
    throw error;
  }
};

export const searchAddressPolyline = async (
  query: string,
  type: 'province' | 'district',
  district: string[] | null,
): Promise<[number, number][][] | [number, number][][][]> => {
  try {
    const response = await fetch(
      `/api/map/polyline?query=${query}&type=${type}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('주소 좌표 경계값 조회 오류', error);
    throw error;
  }
};
