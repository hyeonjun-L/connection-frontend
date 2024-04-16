import React from 'react';
import getCouponPassInfo from '@/utils/getInstructorCouponPassInfo';
import PassListView from './_components/PassListView';
import PassNav from './_components/PassNav';
import { ISearchParams } from '@/types/coupon';
import { IpassData } from '@/types/pass';

const PassPage = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const passInfo = await getCouponPassInfo('PASS', searchParams);

  const myClassListsOption = passInfo?.myClassListsOption ?? [];
  const couponCount = passInfo?.CouponCount ?? 0;
  const passCount = passInfo?.passCount ?? 0;
  const passList: IpassData[] = passInfo?.passList ?? [];

  return (
    <section className="z-0 flex w-full flex-col px-3 sm:px-6 md:px-9 xl:px-0">
      <div className="z-0 flex w-full flex-col rounded-lg bg-white p-5 shadow-float">
        <PassNav couponCount={couponCount} passCount={passCount} />
        <PassListView
          initialData={{ count: passCount, item: passList }}
          myLectureList={myClassListsOption}
        />
      </div>
    </section>
  );
};

export default PassPage;
