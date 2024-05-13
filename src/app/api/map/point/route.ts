import { NextRequest, NextResponse } from 'next/server';

export const preferredRegion = ['icn1'];

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get('query');

  const response = await fetch(
    `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&size=1&query=${query}&type=ADDRESS&category=ROAD&format=json&errorformat=json&key=${process.env.NEXT_PUBLIC_V_WORLD_SECRET_KEY}`,
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
