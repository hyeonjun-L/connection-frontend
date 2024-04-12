import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const GET = async (request: NextRequest) => {
  if (!END_POINT) {
    return NextResponse.json({
      status: 500,
      message: '환경 변수가 설정되지 않았습니다.',
    });
  }

  const token = request.cookies.get('lecturerAccessToken')?.value;

  if (!token) {
    return NextResponse.json(
      {
        status: 401,
        message: '강사 토큰이 존재하지 않습니다.',
      },
      { status: 401 },
    );
  }

  const query = request.nextUrl.searchParams.toString();

  const serverResponse = await fetch(
    `${END_POINT}/lecturer-payments?${query}`,
    {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!serverResponse.ok) {
    const errorData = await serverResponse.json();
    return NextResponse.json(
      {
        status: serverResponse.status,
        message: errorData.message || '서버 요청 오류',
      },
      { status: serverResponse.status },
    );
  }
  const result = await serverResponse.json();

  return NextResponse.json(result);
};
