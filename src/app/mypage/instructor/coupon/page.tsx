import React from 'react';
import getCouponPassInfo from '@/utils/getInstructorCouponPassInfo';
import CouponNav from './_components/CouponNav';
import CouponView from './_components/CouponView';
import { couponGET, ISearchParams } from '@/types/coupon';

const CouponPage = async ({
  searchParams,
}: {
  searchParams: ISearchParams;
}) => {
  const couponInfo = await getCouponPassInfo('COUPON', searchParams);

  const myClassListsOption = couponInfo?.myClassListsOption ?? [];
  const couponCount = couponInfo?.CouponCount ?? 0;
  const passCount = couponInfo?.passCount ?? 0;
  const couponList: couponGET[] = couponInfo?.couponList ?? [];

  return (
    <section className="z-0 flex w-full flex-col px-3 sm:px-6 md:px-9 xl:px-0">
      <div className="z-0 flex w-full flex-col rounded-lg bg-white p-5 shadow-float">
        <CouponNav couponCount={couponCount} passCount={passCount} />

        <CouponView
          initialData={{ count: couponCount, item: couponList }}
          myLectureList={myClassListsOption ?? []}
        />
      </div>
    </section>
  );
};

export default CouponPage;
