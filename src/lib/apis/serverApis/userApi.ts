import { cookies } from 'next/headers';
import { instructorProfile, userProfile } from '@/types/auth';
import { FetchError } from '@/types/types';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const getInstructorProfile = async (): Promise<instructorProfile> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get('lecturerAccessToken')?.value;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(END_POINT + '/lecturers/my-basic-profile', {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `강사 프로필 조회 에러: ${errorData.message || ''}, status: ${
        response.status
      }`,
    );
  }

  const data = await response.json();

  return data.data.lecturerBasicProfile;
};

export const getMyProfile = async (): Promise<userProfile> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get('userAccessToken')?.value;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(END_POINT + '/users/my-pages', {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `유저 프로필 조회 에러: ${errorData.message || ''}, status: ${
        response.status
      }`,
    );
  }

  const data = await response.json();

  return data.data.myProfile;
};

export const accessTokenReissuance = (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return Promise.reject(new Error('Refresh token is not available'));
  }

  return fetch(END_POINT + '/auth/token/refresh', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `refreshToken=${refreshToken}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`refresh 조회 에러: ${response.status}`);
    }

    return response.json().then((json) => {
      const userAccessToken = json.data.userAccessToken;
      const lecturerAccessToken = json.data.lecturerAccessToken;

      if (userAccessToken) {
        return {
          accessToken: userAccessToken,
          refreshToken: refreshToken,
        };
      } else if (lecturerAccessToken) {
        return {
          accessToken: lecturerAccessToken,
          refreshToken: refreshToken,
        };
      } else {
        throw new Error('엑세스 토큰 미 발급');
      }
    });
  });
};

export const checkAccessToken = (
  tokenType: 'userAccessToken' | 'lecturerAccessToken',
): Promise<any> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get(tokenType)?.value;
  const point =
    tokenType === 'userAccessToken'
      ? 'user-access-token'
      : 'lecturer-access-token';

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  return fetch(`${END_POINT}/auth/token/verify/${point}`, {
    method: 'GET',
    credentials: 'include',
    headers,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Token check error: ${response.status}`);
    }

    return response.json();
  });
};
