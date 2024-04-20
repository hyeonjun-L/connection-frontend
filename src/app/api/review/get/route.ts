import { NextRequest, NextResponse } from 'next/server';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const GET = async (request: NextRequest) => {
  if (!END_POINT) {
    return NextResponse.json({
      status: 500,
      message: '환경 변수가 설정되지 않았습니다.',
    });
  }

  const tokenValue = request.cookies.get('userAccessToken')?.value;
  const searchParams = request.nextUrl.searchParams;

  const target = searchParams.get('type');
  const targetId = searchParams.get('targetId');

  if (!target || !targetId) {
    return NextResponse.json(
      {
        status: 403,
        message: 'target값이 존재하지 않습니다.',
      },
      { status: 403 },
    );
  }
  searchParams.delete('type');
  searchParams.delete('targetId');

  const headers: Record<string, string> = {
    Authorization: tokenValue ? `Bearer ${tokenValue}` : '',
    'Content-Type': 'application/json',
  };

  const response = await fetch(
    `${END_POINT}/lecture-reviews/lectureReviewId/${target}/${targetId}?${searchParams.toString()}`,
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
