import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get('query');
  const type = request.nextUrl.searchParams.get('type');

  if (!query || !type) {
    return NextResponse.json(
      {
        status: 400,
        message: '필요 값이 존재하지 않습니다.',
      },
      { status: 400 },
    );
  }

  const filterOption = type === 'province' ? 'ctp_kor_nm' : 'full_nm';
  const data = type === 'province' ? 'LT_C_ADSIDO_INFO' : 'LT_C_ADSIGG_INFO';

  const response = await fetch(
    `https://api.vworld.kr/req/data?service=data&version=2.0&request=GetFeature&format=json&errorformat=json&size=1000&page=1&data=${data}&attrFilter=${filterOption}:like:${query}&crs=EPSG:900913&key=${process.env.NEXT_PUBLIC_V_WORLD_SECRET_KEY}&domain=https://connection-frontend.vercel.app`,
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
