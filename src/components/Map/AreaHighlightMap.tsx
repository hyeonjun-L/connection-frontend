'use client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Fragment, useMemo } from 'react';
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
import ErrorMap from './ErrorMap';

const AreaLocationMap = () => {
  const navermaps = useNavermaps();
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

    const polylineList: [number, number][][] = [];

    response.forEach((item) => {
      if (Array.isArray(item[0][0][0])) {
        item.forEach((subItem) => {
          polylineList.push(...(subItem as [number, number][][]));
        });
      } else {
        polylineList.push(...(item as [number, number][][]));
      }
    });

    const convertedPolylineList = polylineList.map((polyline) =>
      polyline.map(([x, y]) => new naver.maps.LatLng(y, x)),
    );

    return convertedPolylineList;
  };

  const {
    data: polylineList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['polyline', 'classID?'],
    queryFn: getPolyline,
    retry: false,
  });

  return isLoading ? (
    <div className="size-full animate-pulse bg-gray-700" />
  ) : isError || !polylineList ? (
    <ErrorMap />
  ) : (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap zoom={7} center={new naver.maps.LatLng(36.4203004, 128.31796)}>
        {polylineList.map((paths, index) => (
          <Fragment key={index}>
            <Polyline
              strokeColor="pink"
              strokeStyle="solid"
              strokeWeight={1}
              path={paths}
            />
            <Polygon fillColor="#8338ec" fillOpacity={0.2} paths={[paths]} />
          </Fragment>
        ))}
      </NaverMap>
    </MapDiv>
  );
};

const AreaHighlightMap = dynamic(() => Promise.resolve(AreaLocationMap), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-gray-700" />,
});

export default AreaHighlightMap;
