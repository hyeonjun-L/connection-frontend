import { NextRequest, NextResponse } from 'next/server';
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
    `https://api.vworld.kr/req/data?service=data&version=2.0&request=GetFeature&format=json&errorformat=json&size=1000&page=1&data=${dataType}&attrFilter=${filterOption}:like:${query}&crs=EPSG:4326&key=${process.env.NEXT_PUBLIC_V_WORLD_SECRET_KEY}&domain=https://connection-frontend.vercel.app`,
  );

  const result = await response.json();

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
    console.log(responseData[0].geometry.coordinates);
    return NextResponse.json(
      flattenCoordinates(responseData[0].geometry.coordinates),
    );
  }

  const polylineData = responseData
    .filter(({ properties }) =>
      data.district.includes((properties as District).sig_kor_nm),
    )
    .map(({ geometry }) => flattenCoordinates(geometry.coordinates));

  return NextResponse.json(polylineData);
};

function flattenCoordinates(arr, result = []) {
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      flattenCoordinates(item, result);
    } else {
      if (
        typeof item === 'number' &&
        result.length > 0 &&
        Array.isArray(result[result.length - 1]) &&
        result[result.length - 1].length === 1
      ) {
        result[result.length - 1].push(item);
      } else {
        result.push([item]);
      }
    }
  });

  return result;
}
