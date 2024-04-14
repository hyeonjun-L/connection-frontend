import { LECTURE_COUPON_TAKE, LECTURE_PASS_TAKE } from '@/constants/constants';
import { getMyLecture } from '@/lib/apis/serverApis/classApi';
import { getCouponList } from '@/lib/apis/serverApis/couponApis';
import { getIssuedPassList } from '@/lib/apis/serverApis/passApis';
import { mapItemToCoupon } from '@/utils/apiDataProcessor';
import { OptionType, couponGET } from '@/types/coupon';
import { IpassData } from '@/types/pass';

const getCouponPassInfo = async () => {
  let myClassListsOption;
  let CouponCount = 0;
  let passCount = 0;
  let couponList: couponGET[] = [];
  let passList: IpassData[] = [];

  try {
    const reqCouponData = {
      take: LECTURE_COUPON_TAKE,
      couponStatusOption: 'AVAILABLE' as 'AVAILABLE',
      filterOption: 'LATEST' as 'LATEST',
    };

    const reqPassData = {
      take: LECTURE_PASS_TAKE,
      passStatusOptions: 'AVAILABLE' as 'AVAILABLE',
      filterOption: 'LATEST' as 'LATEST',
    };

    const resultLectureLists = getMyLecture();
    const resultCoupon = getCouponList(reqCouponData, 'lecturer');
    const resultPass = getIssuedPassList(reqPassData, 'lecturer');

    const [coupon, pass, lectureList] = await Promise.all([
      resultCoupon,
      resultPass,
      resultLectureLists,
    ]);

    const { itemList, totalItemCount } = pass;

    passList = itemList;
    passCount = totalItemCount;

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
    console.error(error);
  }
};

export default getCouponPassInfo;
