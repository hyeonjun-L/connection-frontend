import { NextRequest, NextResponse } from 'next/server';
import {
  LECTURER_NO_ACCESS,
  LOGIN_REQUIRED_URLS,
  NON_ACCESSIBLE_AFTER_LOGIN,
  USER_NO_ACCESS,
} from './constants/constants';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

const setCookie = (response: NextResponse, name: string, value: string) => {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  });
};

export const middleware = (request: NextRequest) => {
  const user = request.cookies.get('userAccessToken')?.value;
  const lecturer = request.cookies.get('lecturerAccessToken')?.value;
  let response: NextResponse<unknown> | null = null;

  if (user || lecturer) {
    const point = user ? 'user-access-token' : 'lecturer-access-token';

    const headers: Record<string, string> = {
      Authorization: `Bearer ${user || lecturer}`,
    };

    return fetch(new URL(`${END_POINT}/auth/token/verify/${point}`).href, {
      method: 'GET',
      credentials: 'include',
      headers,
    })
      .then((response) => {
        console.log('hi');

        response.json().then((data) => {
          console.log(data);
          if (user && USER_NO_ACCESS.includes(request.nextUrl.pathname)) {
            // 유저가 가면 안되는 lecturer 링크
            console.log('user');
            response = NextResponse.redirect(new URL('/', request.url));
          } else if (
            lecturer &&
            LECTURER_NO_ACCESS.includes(request.nextUrl.pathname)
          ) {
            // 강사가 가면 안되는 user 링크 확인
            response = NextResponse.redirect(new URL('/', request.url));
          } else if (
            NON_ACCESSIBLE_AFTER_LOGIN.includes(request.nextUrl.pathname)
          ) {
            //로그인해서 가면 안되는 링크
            response = NextResponse.redirect(new URL('/', request.url));
          } else {
            console.log('next');

            response = NextResponse.next();
          }
        });
      })
      .catch((error) => {
        if (error.status === 401) {
          const refreshToken = request.cookies.get('refreshToken')?.value;

          return fetch(new URL(`${END_POINT}/auth/token/refresh`).href, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `refreshToken=${refreshToken}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw response;
              }

              const resCookies = response.headers
                .get('set-cookie')
                ?.split('; ');
              const refreshTokenCookie = resCookies?.find((cookie) =>
                cookie.startsWith('refreshToken='),
              );
              const resRefreshToken = refreshTokenCookie?.split('=')[1];

              if (!resRefreshToken) {
                throw new Error('refresh token 재발급 에러');
              }

              return response.json().then((json) => {
                const userAccessToken = json.data.userAccessToken;
                const lecturerAccessToken = json.data.lecturerAccessToken;

                const tokenName = user
                  ? 'userAccessToken'
                  : 'lecturerAccessToken';

                const accessToken = user
                  ? userAccessToken
                  : lecturerAccessToken;

                const response = NextResponse.redirect(request.url);

                setCookie(response, tokenName, accessToken);
                setCookie(response, 'refreshToken', resRefreshToken);

                return response;
              });
            })
            .catch(() => {
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
            });
        } else {
          return NextResponse.redirect(new URL('/error', request.url));
        }
      });
  }

  if (response) {
    response;
  }

  if (LOGIN_REQUIRED_URLS.includes(request.nextUrl.pathname)) {
    //강사 & 유저 토큰이 필요한 링크(로그인이 필요한 링크)
    return Promise.resolve(
      NextResponse.redirect(new URL('/login', request.url)),
    );
  }

  return Promise.resolve(NextResponse.next());
};

export const config = {
  matcher: ['/my/:path*', '/', '/aaa', '/instructor/apply', '/class/create'], // '/login', '/api/my/:path*', '/api/auth/logout
};
