interface ValidityPeriod {
  startDate: string;
  endDate: string;
}

interface BaseCouponData {
  couponName: string;
  allowDuplicateCoupons: boolean;
  maxDiscountAmount?: number;
  validityPeriod: ValidityPeriod;
  couponQuantity: '원' | '%';
  discountValue: number;
  private: boolean;
  lectureIds: SelectClassType[];
}

interface CouponDataWithDiscount extends BaseCouponData {
  couponDistributionCount: number;
  hasCouponLimit?: never;
}

interface CouponDataWithLimit extends BaseCouponData {
  couponDistributionCount?: never;
  hasCouponLimit: boolean;
}

export type CouponData = CouponDataWithDiscount | CouponDataWithLimit;

export interface couponGET {
  //추후 수정 예정
  discount: number;
  unit: string;
  title: string;
  startAt: string;
  endAt: string;
  isStackable: boolean;
  maxDiscountAmount?: number;
}

export interface SelectCoupon {
  value: CouponGET;
  label: string;
}

export type SelectCoupons = SelectCoupon[];

export interface SelectClassType {
  value: string | number;
  label: string;
}
