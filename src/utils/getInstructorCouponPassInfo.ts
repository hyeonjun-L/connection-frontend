import { redirect } from 'next/navigation';
import { LECTURE_COUPON_TAKE, LECTURE_PASS_TAKE } from '@/constants/constants';
import { getMyLecture } from '@/lib/apis/serverApis/classApi';
import { getCouponList } from '@/lib/apis/serverApis/couponApis';
import { getIssuedPassList } from '@/lib/apis/serverApis/passApis';
import { mapItemToCoupon } from '@/utils/apiDataProcessor';
import { ISearchParams, OptionType, couponGET } from '@/types/coupon';
import { IpassData } from '@/types/pass';
import { FetchError } from '@/types/types';

const getCouponPassInfo = async (
  type: 'COUPON' | 'PASS',
  filterOption?: ISearchParams,
) => {
  let myClassListsOption;
  let CouponCount = 0;
  let passCount = 0;
  let couponList: couponGET[] = [];
  let passList: IpassData[] = [];

  try {
    const reqCouponData = {
      take: filterOption?.take ?? LECTURE_COUPON_TAKE,
      couponStatusOption:
        type === 'COUPON'
          ? filterOption?.couponStatusOption ?? 'AVAILABLE'
          : 'AVAILABLE',
      filterOption:
        type === 'COUPON' ? filterOption?.filterOption ?? 'LATEST' : 'LATEST',
      lectureId: type === 'COUPON' ? filterOption?.lectureId : undefined,
    };

    const reqPassData = {
      take: LECTURE_PASS_TAKE,
      passStatusOptions:
        type === 'PASS'
          ? filterOption?.passStatusOptions ?? 'AVAILABLE'
          : 'AVAILABLE',
      filterOption:
        type === 'PASS' ? filterOption?.filterOption ?? 'LATEST' : 'LATEST',
      lectureId: type === 'PASS' ? filterOption?.lectureId : undefined,
    };

    const resultLectureLists = getMyLecture();
    const resultCoupon = getCouponList(reqCouponData, 'lecturer');
    const resultPass = getIssuedPassList(reqPassData, 'lecturer');

    const [coupon, pass, lectureList] = await Promise.all([
      resultCoupon,
      resultPass,
      resultLectureLists,
    ]);

    const { item, count } = pass;

    passList = item;
    passCount = count;

    if (coupon) {
      const { totalItemCount: resTotalItemCount, itemList: resCouponList } =
        coupon;
      CouponCount = resTotalItemCount;

      couponList = resCouponList?.map(mapItemToCoupon) ?? [];
    }

    myClassListsOption = lectureList.map(
      ({ id, title }): OptionType => ({
        value: id,
        label: title,
      }),
    );

    myClassListsOption.length > 0 &&
      myClassListsOption.unshift({
        value: 'select-all',
        label: `전체 클래스(${myClassListsOption.length})`,
      });

    return { CouponCount, couponList, passCount, myClassListsOption, passList };
  } catch (error) {
    if (error instanceof Error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 400) {
        redirect(
          type === 'COUPON'
            ? '/mypage/instructor/coupon'
            : '/mypage/instructor/pass',
        );
      }
      console.error(error);
    }
  }
};

export default getCouponPassInfo;
