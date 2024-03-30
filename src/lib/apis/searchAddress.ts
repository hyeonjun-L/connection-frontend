import { AddressData, Point } from '@/types/address';
import { FetchError } from '@/types/types';

export const searchAddress = async (keyword: string, page: number | string) => {
  try {
    const response = await fetch(
      `/api/map/address?keyword=${encodeURIComponent(keyword)}&page=${page}`,
    );

    if (!response.ok) throw new Error('Network response was not ok');

    const data: AddressData = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAddressPoint = async (query: string): Promise<Point> => {
  try {
    const response = await fetch(`/api/map/point?query=${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data.response.result.items[0].point;
  } catch (error) {
    console.error('주소 좌표값 조회 오류', error);
    throw error;
  }
};
