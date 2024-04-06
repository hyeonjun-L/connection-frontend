export interface AddressData {
  results: {
    common: {
      errorMessage: string;
      countPerPage: string;
      totalCount: string;
      errorCode: string;
      currentPage: string;
    };
    juso: Juso[] | [];
  };
}

export interface Juso {
  detBdNmList: string;
  bdNm: string;
  engAddr: string;
  rn: string;
  emdNm: string;
  zipNo: string;
  roadAddr: string;
  roadAddrPart2?: string;
  emdNo?: string;
  sggNm?: string;
  jibunAddr?: string;
  siNm?: string;
  roadAddrPart1?: string;
  detailAddress?: string;
}

export interface ProcessedJuso {
  roadAddr: string;
  detailAddress: string;
  bdNm: string;
}

export interface RoadAddrPoint {
  status: 'NOT_FOUND' | 'OK' | 'ERROR';
  result: {
    items: [
      {
        id: number;
        address: {
          bldnm: string;
          bldnmdc: string;
          category: 'ROAD' | 'PLACE' | 'ADDRESS' | 'DISTRICT';
          parcel: string;
          road: string;
          zipcode: number;
        };
        point: Point;
      },
    ];
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface Polyline {
  geometry: { type: 'MultiPolygon'; coordinates: [] };
  id: 'LT_C_ADSIDO_INFO' | 'LT_C_ADSIGG_INFO';
  properties: Province | District;
  type: 'Feature';
}

export interface Province {
  ctprvn_cd: number;
  ctp_kor_nm: string;
  ctp_eng_nm: string;
}

interface District {
  sig_cd: number;
  full_nm: string;
  sig_kor_nm: string;
  sig_eng_nm: string;
}
