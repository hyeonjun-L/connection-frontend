import { NextRequest, NextResponse } from 'next/server';
import {
  LECTURER_NO_ACCESS,
  LOGIN_REQUIRED_URLS,
  NON_ACCESSIBLE_AFTER_LOGIN,
  USER_NO_ACCESS,
} from './constants/constants';
import { accessTokenReissuance } from './lib/apis/serverApis/userApi';
import { FetchError } from './types/types';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

const setCookie = (response: NextResponse, name: string, value: string) => {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  });
};

const checkAccessToken = async (
  tokenType: 'userAccessToken' | 'lecturerAccessToken',
  authorization: string,
) => {
  const point =
    tokenType === 'userAccessToken'
      ? 'user-access-token'
      : 'lecturer-access-token';

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(`${END_POINT}/auth/token/verify/${point}`, {
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

  return response.json();
};

export const middleware = async (request: NextRequest) => {
  const user = request.cookies.get('userAccessToken')?.value;
  const lecturer = request.cookies.get('lecturerAccessToken')?.value;

  console.log('user:::', user);
  console.log('lecturer:::', lecturer);

  if (user || lecturer) {
    try {
      if (user) {
        const accessTokenCheckResponse = await checkAccessToken(
          'userAccessToken',
          user,
        );
        const userAccessTokenCheckData = await accessTokenCheckResponse.json();

        if (USER_NO_ACCESS.includes(request.nextUrl.pathname)) {
          // 유저가 가면 안되는 lecturer 링크
          return NextResponse.redirect(new URL('/', request.url));
        }
      } else if (lecturer) {
        console.log(await checkAccessToken('lecturerAccessToken', lecturer));

        if (LECTURER_NO_ACCESS.includes(request.nextUrl.pathname)) {
          // 강사가 가면 안되는 user 링크 확인
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      if (NON_ACCESSIBLE_AFTER_LOGIN.includes(request.nextUrl.pathname)) {
        //로그인해서 가면 안되는 링크
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      if (error instanceof Error) {
        const fetchError = error as FetchError;
        if (fetchError.status === 401) {
          try {
            const response = NextResponse.redirect(request.url);

            const { accessToken, refreshToken } = await accessTokenReissuance();
            console.log(accessToken, refreshToken);

            const tokenName = user ? 'userAccessToken' : 'lecturerAccessToken';

            setCookie(response, tokenName, accessToken);
            setCookie(response, 'refreshToken', refreshToken);

            return response;
          } catch (error) {
            const includes = LOGIN_REQUIRED_URLS.includes(
              request.nextUrl.pathname,
            );

            const response = includes
              ? NextResponse.redirect(new URL('/login', request.url))
              : NextResponse.redirect(request.url);

            if (!includes) response.cookies.set('reload', 'true');

            response.cookies.delete('userAccessToken');
            response.cookies.delete('lecturerAccessToken');
            response.cookies.delete('refreshToken');

            return response;
          }
        }
      }
      return NextResponse.redirect(new URL('/', request.url)); //추후 서버 에러 페이지로 이동
    }
  }

  if (LOGIN_REQUIRED_URLS.includes(request.nextUrl.pathname)) {
    //강사 토큰이 필요한 링크
    //유저 토큰이 필요한 링크
    // 로그인이 필요한 링크
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/my/:path*', '/', '/instructor/apply', '/class/create'], // '/login', '/api/my/:path*', '/api/auth/logout
};
