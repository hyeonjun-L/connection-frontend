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

const checkAccessToken = (headers: Record<string, string>, point: string) => {
  return fetch(new URL(`${END_POINT}/auth/token/verify/${point}`).href, {
    method: 'GET',
    credentials: 'include',
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const testAPI = async (headers: Record<string, string>, point: string) => {
  return await fetch(new URL(`${END_POINT}/auth/token/verify/${point}`).href, {
    method: 'GET',
    credentials: 'include',
    headers,
  });
};

export const middleware = async (request: NextRequest) => {
  const user = request.cookies.get('userAccessToken')?.value;
  const lecturer = request.cookies.get('lecturerAccessToken')?.value;
  let clientResponse: NextResponse<unknown> | null = null;

  if (user || lecturer) {
    const point = user ? 'user-access-token' : 'lecturer-access-token';

    const headers: Record<string, string> = {
      Authorization: `Bearer ${user || lecturer}`,
      'Accept-Encoding': 'zlib',
    };

    checkAccessToken(headers, point).then((test) => {
      console.log('aaa:::', test);
    });

    const test = await testAPI(headers, point);
    console.log(test);
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

// .then((response) => {
//   console.log('hi');
//   return response.json();
// })
// .then((data) => {
//   console.log(data);
//   if (data.statusCode === 200) {
//     if (user && USER_NO_ACCESS.includes(request.nextUrl.pathname)) {
//       // 유저가 가면 안되는 lecturer 링크
//       console.log('user');
//       clientResponse = NextResponse.redirect(new URL('/', request.url));
//     } else if (
//       lecturer &&
//       LECTURER_NO_ACCESS.includes(request.nextUrl.pathname)
//     ) {
//       // 강사가 가면 안되는 user 링크 확인
//       clientResponse = NextResponse.redirect(new URL('/', request.url));
//     } else if (
//       NON_ACCESSIBLE_AFTER_LOGIN.includes(request.nextUrl.pathname)
//     ) {
//       //로그인해서 가면 안되는 링크
//       clientResponse = NextResponse.redirect(new URL('/', request.url));
//     } else {
//       console.log('next');

//       clientResponse = NextResponse.next();
//     }
//   } else if (data.statusCode === 401) {
//     const refreshToken = request.cookies.get('refreshToken')?.value;

//     return fetch(new URL(`${END_POINT}/auth/token/refresh`).href, {
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         Cookie: `refreshToken=${refreshToken}`,
//       },
//     })
//       .then((response) => {
//         const resCookies = response.headers
//           .get('set-cookie')
//           ?.split('; ');
//         const refreshTokenCookie = resCookies?.find((cookie) =>
//           cookie.startsWith('refreshToken='),
//         );
//         const resRefreshToken = refreshTokenCookie?.split('=')[1];
//         console.log('cookie::::', resCookies);
//         console.log('cookietoken:::', refreshTokenCookie);
//         console.log('refreshToken:::', resRefreshToken);

//         return response.json();
//       })
//       .then((json) => {
//         console.log(json);
//         if (json.statusCode === 200) {
//           const userAccessToken = json.data.userAccessToken;
//           const lecturerAccessToken = json.data.lecturerAccessToken;

//           const tokenName = user
//             ? 'userAccessToken'
//             : 'lecturerAccessToken';

//           const accessToken = user
//             ? userAccessToken
//             : lecturerAccessToken;

//           clientResponse = NextResponse.redirect(request.url);

//           setCookie(clientResponse, tokenName, accessToken);
//           if (resRefreshToken) {
//             setCookie(clientResponse, 'refreshToken', resRefreshToken);
//           }
//         } else {
//           console.log('없음');
//           const includes = LOGIN_REQUIRED_URLS.includes(
//             request.nextUrl.pathname,
//           );

//           clientResponse = includes
//             ? NextResponse.redirect(new URL('/login', request.url))
//             : NextResponse.redirect(request.url);

//           if (!includes) clientResponse.cookies.set('reload', 'true');

//           clientResponse.cookies.delete('userAccessToken');
//           clientResponse.cookies.delete('lecturerAccessToken');
//           clientResponse.cookies.delete('refreshToken');
//         }
//       });
//   } else {
//     clientResponse = NextResponse.redirect(
//       new URL('/error', request.url),
//     );
//   }
// })
// .then(() => {
//   console.log(clientResponse);
//   if (clientResponse) {
//     return clientResponse;
//   }

//   if (LOGIN_REQUIRED_URLS.includes(request.nextUrl.pathname)) {
//     //강사 & 유저 토큰이 필요한 링크(로그인이 필요한 링크)
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// });
