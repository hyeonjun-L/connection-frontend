'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getCouponLists } from '@/lib/apis/couponApis';
import formatDate from '@/utils/formatDate';
import AppliedCouponDisplay from './ClassPrice/AppliedCouponDisplay';
import ClassInfo from './ClassPrice/ClassInfo';
import CouponButton from './ClassPrice/CouponButton';
import CouponCreator from './ClassPrice/CouponCreator';
import Accordion from '@/components/Accordion/Accordion';
import { couponGET, createCoupon } from '@/types/coupon';

const ClassPrice = () => {
  const [isCouponSectionOpen, setIsCouponSectionOpen] = useState(false);
  const [newCouponList, setNewCouponList] = useState<couponGET[]>([]);
  const { getValues, setValue } = useFormContext();

  const reqData = {
    take: 10000, //추후 null로 변경
    couponStatusOption: 'AVAILABLE' as 'AVAILABLE',
    filterOption: 'LATEST' as 'LATEST',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['couponLists'],
    queryFn: () => getCouponLists(reqData, 'lecturer'),
  });

  const couponList = useMemo(() => {
    const couponList =
      data?.item.map((coupon) => {
        coupon.startAt = formatDate(coupon.startAt);
        coupon.endAt = formatDate(coupon.endAt);
        return coupon;
      }) ?? [];

    return [...couponList, ...newCouponList];
  }, [data, newCouponList]);

  const toggleCouponSection = () => {
    setIsCouponSectionOpen((prev) => !prev);
  };

  const changeCouponList = (couponOption: createCoupon) => {
    const formattedCoupon: couponGET = {
      ...couponOption,
      startAt: formatDate(couponOption.startAt),
      endAt: formatDate(couponOption.endAt),
      lectureCouponTarget: couponOption.lectureCouponTarget.map(
        ({ value, label }) => ({ lecture: { id: value, title: label } }),
      ),
    };

    setValue('coupons', [
      ...(getValues('coupons') || []),
      { value: formattedCoupon, label: formattedCoupon.title },
    ]);
    setNewCouponList((couponList) => [formattedCoupon, ...couponList]);
  };

  return (
    <>
      <ClassInfo />

      <section
        className={`flex flex-col ${
          isCouponSectionOpen ? 'gap-7' : ''
        } border-y-2 border-solid border-sub-color1 py-5`}
      >
        <CouponButton
          isCouponSectionOpen={isCouponSectionOpen}
          toggleCouponSection={toggleCouponSection}
        />

        <Accordion isOpen={isCouponSectionOpen}>
          <div className="flex flex-col gap-7">
            <CouponCreator changeCouponList={changeCouponList} />

            <hr className="border-gray-500" />
          </div>
        </Accordion>
        {isLoading ? (
          isCouponSectionOpen && (
            <div className="mb-3 w-full gap-10 sm:flex">
              <div className="mb-3 h-7 animate-pulse bg-gray-700 sm:mb-0 sm:w-1/6" />
              <div className="h-7 w-5/6 animate-pulse flex-wrap gap-5 bg-gray-700" />
            </div>
          )
        ) : (
          <AppliedCouponDisplay
            isCouponSectionOpen={isCouponSectionOpen}
            couponList={couponList}
          />
        )}
      </section>
    </>
  );
};

export default ClassPrice;
