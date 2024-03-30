'use client';
import '../../styles/mapInfowindow.css';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  InfoWindow,
  Marker,
  NaverMap,
  useNavermaps,
  Container as MapDiv,
} from 'react-naver-maps';
import errorImg from '@/images/ErrorImg.webp';

interface MapProps {
  address: string;
  studioName: string;
}

const StudioLocationMap = ({ address, studioName }: MapProps) => {
  const navermaps = useNavermaps();

  const convertToLatLngAndXY = (y: string, x: string) => {
    const latLng = new naver.maps.LatLng(Number(y), Number(x));
    const { x: convertedX, y: convertedY } =
      navermaps.TransCoord.fromLatLngToEPSG3857(latLng);
    return { latLng, x: convertedX, y: convertedY };
  };

  const geocodeAddress = (query: string, subQuery: string) => {
    return new Promise<{ latLng: naver.maps.LatLng; x: number; y: number }>(
      (resolve, reject) => {
        const processGeocodeResponse = (
          searchQuery: string,
          response: naver.maps.Service.GeocodeResponse,
        ) => {
          if (response.v2.errorMessage) {
            reject(
              new Error(
                `Geocode Error, error: ${response.v2.errorMessage} address: ${searchQuery}`,
              ),
            );
            return;
          }
          if (response.v2.meta.totalCount === 0) {
            if (searchQuery === subQuery) {
              reject(new Error('No results found'));
              return;
            } else {
              searchAddress(subQuery);
              return;
            }
          }

          const item = response.v2.addresses[0];
          resolve(convertToLatLngAndXY(item.y, item.x));
        };

        const searchAddress = (searchQuery: string) => {
          navermaps.Service.geocode(
            { query: searchQuery },
            (status, response) => processGeocodeResponse(searchQuery, response),
          );
        };

        searchAddress(query);
      },
    );
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['map', address],
    queryFn: () => geocodeAddress(address, studioName),
  });

  return isLoading ? (
    <div className="size-full animate-pulse bg-gray-700" />
  ) : isError || !data ? (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <Image
        src={errorImg}
        alt="지도 데이터 오류 이미지"
        priority={true}
        className="h-auto w-auto flex-shrink object-cover"
      />
      <p>장소의 올바른 위치를 찾지 못했습니다.</p>
    </div>
  ) : (
    <StudioInfoWindow {...data} studioName={studioName} address={address} />
  );
};

interface StudioInfoWindowProps extends MapProps {
  latLng: naver.maps.LatLng;
  x: number;
  y: number;
}

const StudioInfoWindow = ({
  latLng,
  x,
  y,
  studioName,
  address,
}: StudioInfoWindowProps) => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [infowindow, setInfoWindow] = useState<naver.maps.InfoWindow | null>(
    null,
  );

  const startLink = `https://map.naver.com/p/directions/${x},${y},${studioName}/-/-/transit?c=17.56,0,0,0,dh`;
  const destinationLink = `https://map.naver.com/p/directions/-/${x},${y},${studioName}/-/transit?c=17.56,0,0,0,dh`;

  useEffect(() => {
    if (map && infowindow) {
      infowindow.open(map, latLng);
    }
  }, [infowindow, map]);

  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap ref={setMap} defaultCenter={latLng}>
        <Marker position={latLng} />
        <InfoWindow
          content={`
      <div class="infowindow-container">
        <address class="studio-name">${studioName}</address>
        <address class="studio-address">${address}</address>
        <div class="button-container">
          <a class="start-button" href="${startLink}" target="_blank" rel="noopener noreferrer">출발</a>
          <a class="destination-button" href="${destinationLink}" target="_blank" rel="noopener noreferrer">도착</a>
        </div>
      </div>
    `}
          ref={setInfoWindow}
          borderWidth={0}
          backgroundColor="none"
          anchorSize={new naver.maps.Size(0, 40)}
        />
      </NaverMap>
    </MapDiv>
  );
};

const Map = dynamic(() => Promise.resolve(StudioLocationMap), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-gray-700" />,
});

export default Map;
