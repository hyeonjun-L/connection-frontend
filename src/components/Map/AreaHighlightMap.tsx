'use client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import {
  NaverMap,
  Container as MapDiv,
  Polyline,
  useNavermaps,
  Polygon,
} from 'react-naver-maps';
import { WARD_LIST } from '@/constants/administrativeDistrict';
import { searchAddressPolyline } from '@/lib/apis/searchAddress';
import { resRegions } from '@/utils/apiDataProcessor';

const AreaLocationMap = () => {
  const naverMap = useNavermaps();

  const regions = [
    { region: { administrativeDistrict: '경기도', district: '전 지역' } },
    { region: { administrativeDistrict: '부산광역시', district: '중구' } },
    { region: { administrativeDistrict: '부산광역시', district: '서구' } },
  ];

  const addresses = useMemo(
    () => resRegions(regions.map(({ region }) => region)),
    [],
  );

  const getPolyline = async () => {
    const promises = Object.entries(addresses).map(([province, district]) => {
      const isAll = WARD_LIST[province].length === district.length;
      return searchAddressPolyline(
        province,
        isAll ? 'province' : 'district',
        isAll ? null : district,
      );
    });

    const response = await Promise.all(promises);

    const polylineLists: [number, number][][] = [];

    response.forEach((item) => {
      if (Array.isArray(item[0][0])) {
        (item as [number, number][][]).forEach((innerItem) => {
          polylineLists.push(innerItem);
        });
      } else {
        polylineLists.push(item as [number, number][]);
      }
    });

    return polylineLists.map((polylineList) =>
      polylineList.map(([x, y]) => new naver.maps.LatLng(y, x)),
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ['polyline', 'classID?'],
    queryFn: getPolyline,
    retry: false,
  });

  if (isLoading || !data) return null;

  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap center={new naver.maps.LatLng(37.3674001, 127.1181196)}>
        <Polyline
          strokeColor="blue"
          strokeStyle="solid"
          strokeWeight={1}
          path={data[0]}
        />
        <Polyline
          strokeColor="blue"
          strokeStyle="solid"
          strokeWeight={1}
          path={data[1]}
        />
        <Polyline
          strokeColor="blue"
          strokeStyle="solid"
          strokeWeight={1}
          path={data[2]}
        />
      </NaverMap>
    </MapDiv>
  );
};

const AreaHighlightMap = dynamic(() => Promise.resolve(AreaLocationMap), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-gray-700" />,
});

export default AreaHighlightMap;
