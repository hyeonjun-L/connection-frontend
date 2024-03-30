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
