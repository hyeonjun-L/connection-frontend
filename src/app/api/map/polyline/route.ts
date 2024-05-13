import { NextRequest, NextResponse } from 'next/server';
import { FRONT_DOMAIN } from '@/constants/constants';
import { District, Polyline } from '@/types/address';

export const POST = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get('query');
  const type = request.nextUrl.searchParams.get('type');
  const data = await request.json();

  if (!query || !type) {
    return NextResponse.json(
      {
        status: 400,
        message: '필요 값이 존재하지 않습니다.',
      },
      { status: 400 },
    );
  }

  const isProvince = type === 'province';
  const filterOption = isProvince ? 'ctp_kor_nm' : 'full_nm';
  const dataType = isProvince ? 'LT_C_ADSIDO_INFO' : 'LT_C_ADSIGG_INFO';

  if (!isProvince && !data.district) {
    return NextResponse.json(
      {
        status: 400,
        message: '지역 값이 존재하지 않습니다.',
      },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://api.vworld.kr/req/data?service=data&version=2.0&request=GetFeature&format=json&errorformat=json&size=1000&page=1&data=${dataType}&attrFilter=${filterOption}:like:${query}&crs=EPSG:4326&key=${process.env.NEXT_PUBLIC_V_WORLD_SECRET_KEY}&domain=${FRONT_DOMAIN}`,
  );

  const result = await response.json();
  
  console.log(result);
  
  if (result.response.status !== 'OK') {
    return NextResponse.json(
      {
        status: response.status,
        message: result.response.status || '서버 요청 오류',
      },
      { status: response.status },
    );
  }

  const responseData = result.response.result.featureCollection
    .features as Polyline[];

  if (isProvince) {
    return NextResponse.json(
      responseData[0].geometry.coordinates.flatMap((a) => a),
    );
  }

  const polylineData = responseData
    .filter(({ properties }) =>
      data.district.some((district: string) =>
        (properties as District).sig_kor_nm.startsWith(district),
      ),
    )
    .map(({ geometry }) => geometry.coordinates.flatMap((a) => a));

  return NextResponse.json(polylineData);
};
