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
  Marker,
} from 'react-naver-maps';
import { EPSG_PROVINCE } from '@/constants/administrativeDistrict';
import { searchAddressPolyline } from '@/lib/apis/searchAddress';
import ErrorMap from './ErrorMap';
import { IClassRegionResponse } from '@/types/class';

const AreaLocationMap = (regions: IClassRegionResponse[]) => {
  useNavermaps();

  const addresses = useMemo(
    () =>
      regions.reduce(
        (
          acc: { [key: string]: string[] },
          { region: { administrativeDistrict, district } },
        ) => {
          if (acc[administrativeDistrict]) {
            acc[administrativeDistrict].push(district);
          } else {
            acc[administrativeDistrict] = [district];
          }
          return acc;
        },
        {},
      ),
    [],
  );

  const getDefaultCenter = (addresses: { [key: string]: string[] }) => {
    const administrativeDistrictList = Object.keys(addresses);
    if (administrativeDistrictList.length === 1) {
      const [lng, lat] = EPSG_PROVINCE[administrativeDistrictList[0]];
      return new naver.maps.LatLng(lat, lng);
    }
    const [lng, lat] = EPSG_PROVINCE.default;
    return new naver.maps.LatLng(lat, lng);
  };

  const markerName = regions.map(({ region }) =>
    region.district === '전 지역'
      ? region.administrativeDistrict
      : region.district,
  );

  const getPolyline = async () => {
    const promises = Object.entries(addresses).map(([province, district]) => {
      const isAll = district[0] === '전 지역';
      return searchAddressPolyline(
        province,
        isAll ? 'province' : 'district',
        isAll ? null : district,
      );
    });

    const response = await Promise.all(promises);

    const polylineList: [number, number][][] = [];
    const markerPoint: [number, number][] = [];

    response.forEach((item) => {
      if (Array.isArray(item[0][0][0])) {
        item.forEach((subItem) => {
          markerPoint.push(subItem[0][0] as [number, number]);
          polylineList.push(...(subItem as [number, number][][]));
        });
      } else {
        markerPoint.push(item[0][0] as [number, number]);
        polylineList.push(...(item as [number, number][][]));
      }
    });

    const convertedPolylineList = polylineList.map((polyline) =>
      polyline.map(([x, y]) => new naver.maps.LatLng(y, x)),
    );

    return { polylineList: convertedPolylineList, markerPoint };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['polyline', 'classID?'],
    queryFn: getPolyline,
    retry: false,
  });

  return isLoading ? (
    <div className="size-full animate-pulse bg-gray-700" />
  ) : isError || !data ? (
    <ErrorMap />
  ) : (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap
        zoom={Object.keys(addresses).length === 1 ? 8 : 3}
        center={getDefaultCenter(addresses)}
      >
        {data.markerPoint.map(([x, y], index) => (
          <Marker
            key={x}
            position={new naver.maps.LatLng(y, x)}
            icon={{
              content: `<div class="markerBox">${markerName[index]}</div>`,
            }}
          />
        ))}
        {data.polylineList.map((paths, index) => (
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
