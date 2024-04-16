'use client';
import { LECTURE_COUPON_TAKE } from '@/constants/constants';
import usePageNation from '@/hooks/usePageNation';
import { NotFoundSVG } from '@/icons/svg';
import { getCouponLists } from '@/lib/apis/couponApis';
import CouponLoading from './loading/CouponLoading';
import Coupon from '@/components/Coupon/Coupon';
import ClassFilterSelect from '@/components/Filter/ClassSelectFilter';
import Pagination from '@/components/Pagination/Pagination';
import PaginationLoading from '@/components/Pagination/PaginationLoading';
import { IgetFunction, SelectClassType, couponGET } from '@/types/coupon';

interface CouponViewProps {
  initialData: { count: number; item: couponGET[] };
  myLectureList: SelectClassType[];
}

const CouponView = ({ initialData, myLectureList }: CouponViewProps) => {
  const getListFunctionHandler = async (
    data: IgetFunction,
    signal?: AbortSignal,
  ) => {
    return await getCouponLists(data, 'lecturer', signal);
  };

  const {
    items: couponLists,
    totalItemCount,
    filterState,
    isLoading,
    changeFilterState,
    changePage,
  } = usePageNation<couponGET>({
    initialData,
    defaultFilterState: {
      take: LECTURE_COUPON_TAKE,
      targetPage: 1,
      couponStatusOption: 'AVAILABLE',
      filterOption: 'LATEST',
      lectureId: undefined,
    },
    queryType: 'instructorCoupon',
    queryFn: getListFunctionHandler,
  });

  const selectClassHandler = (selectedOptions: any) => {
    changeFilterState(
      {
        lectureId:
          selectedOptions.value === 'select-all'
            ? undefined
            : selectedOptions.value,
      },
      true,
    );
  };

  const options: {
    id: 'AVAILABLE' | 'DISABLED' | 'USED' | 'EXPIRED';
    label: string;
  }[] = [
    {
      id: 'AVAILABLE',
      label: '활성화 쿠폰',
    },
    {
      id: 'DISABLED',
      label: '만료 쿠폰',
    },
  ];

  const sortOptions: {
    id: 'LATEST' | 'UPCOMING' | 'HIGHEST_PRICE' | 'BEST_SELLING';
    label: string;
  }[] = [
    { id: 'LATEST', label: '최신순' },
    { id: 'UPCOMING', label: '기간 임박순' },
  ];

  const pageCount = Math.ceil(totalItemCount / LECTURE_COUPON_TAKE);

  return (
    <>
      <nav className="flex flex-wrap items-center gap-2 border-y border-solid border-gray-500 py-5">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-1">
            <input
              id={option.id}
              type="checkbox"
              className="peer h-[18px] w-[18px] accent-black"
              checked={filterState.couponStatusOption === option.id}
              onChange={() =>
                changeFilterState({ couponStatusOption: option.id }, true)
              }
            />
            <label
              htmlFor={option.id}
              className="cursor-pointer text-gray-500 peer-checked:text-black"
            >
              {option.label}
            </label>
          </div>
        ))}
        <div className="w-80">
          <ClassFilterSelect
            options={myLectureList}
            value={
              myLectureList.find(
                ({ value }) => value === filterState.lectureId,
              ) ?? myLectureList[0]
            }
            onChange={selectClassHandler}
          />
        </div>
      </nav>

      <nav className="flex gap-2.5 py-4">
        {filterState.couponStatusOption === 'AVAILABLE' &&
          sortOptions.map((option) => (
            <button
              key={option.id}
              className={`flex text-sm font-bold ${
                filterState.filterOption !== option.id && 'text-gray-500'
              }`}
              onClick={() => changeFilterState({ filterOption: option.id })}
            >
              {option.label}
            </button>
          ))}
      </nav>

      {isLoading ? (
        <CouponLoading />
      ) : couponLists.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 pb-4 sm:justify-normal">
          {couponLists.map((coupon) => (
            <Coupon
              key={coupon.id}
              coupon={coupon}
              type="lecturer"
              expiration={
                filterState.couponStatusOption === 'DISABLED' ||
                filterState.couponStatusOption === 'EXPIRED'
              }
            />
          ))}
        </div>
      ) : (
        <div className="my-7 flex w-full flex-col items-center justify-center gap-8 text-lg font-semibold text-gray-100">
          <NotFoundSVG />
          <p>해당 쿠폰이 없습니다!</p>
        </div>
      )}

      {couponLists.length > 0 && pageCount === 0 ? (
        <PaginationLoading />
      ) : (
        pageCount > 0 && (
          <nav className="my-8">
            <Pagination
              pageCount={pageCount}
              currentPage={
                filterState.currentPage ? filterState.currentPage - 1 : 0
              }
              onPageChange={changePage}
            />
          </nav>
        )
      )}
    </>
  );
};

export default CouponView;
