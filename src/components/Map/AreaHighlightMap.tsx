'use client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { NaverMap, Container as MapDiv } from 'react-naver-maps';
import { WARD_LIST } from '@/constants/administrativeDistrict';
import { searchAddressPolyline } from '@/lib/apis/searchAddress';
import { resRegions } from '@/utils/apiDataProcessor';

const AreaLocationMap = () => {
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
    const polylineList = [];
    for (const [province, district] of Object.entries(addresses)) {
      const result = await searchAddressPolyline(
        province,
        WARD_LIST[province].length === district.length
          ? 'province'
          : 'district',
      );
      polylineList.push(result);
    }
    return polylineList;
  };

  const { data } = useQuery({
    queryKey: ['polyline', 'classID?'],
    queryFn: getPolyline,
  });

  console.log(data);

  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap />
    </MapDiv>
  );
};

const AreaHighlightMap = dynamic(() => Promise.resolve(AreaLocationMap), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-gray-700" />,
});

export default AreaHighlightMap;
