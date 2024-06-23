import { NextRequest, NextResponse } from 'next/server';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const GET = async (request: NextRequest) => {
  if (!END_POINT) {
    return NextResponse.json({
      status: 500,
      message: '환경 변수가 설정되지 않았습니다.',
    });
  }

  const tokenValue = request.cookies.get(`userAccessToken`)?.value;

  const headers: Record<string, string> = tokenValue
    ? {
        Authorization: `Bearer ${tokenValue}`,
        'Content-Type': 'application/json',
      }
    : { 'Content-Type': 'application/json' };

  const response = await fetch(
    `${END_POINT}/search/lecture?${request.nextUrl.searchParams.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      headers,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      {
        status: response.status,
        message: errorData.message || '서버 요청 오류',
      },
      { status: response.status },
    );
  }

  const result = await response.json();

  return NextResponse.json(result);
};
