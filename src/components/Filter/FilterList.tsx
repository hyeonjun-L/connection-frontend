'use client';
import Link from 'next/link';
import useTouchScroll from '@/hooks/useTouchScroll';
import { ResetSVG } from '@/icons/svg';
import { usefilterStore } from '@/store/filterStore';
import DateFilterContainer from './Date/DateFilterContainer';
import DayTimeFilter from './DayTime/DayTimeFilterContainer';
import FilterMobileModal from './FilterMobileModal';
import GenreFilterContainer from './Genre/GenreFilterContainer';
import GroupFilterContainer from './Group/GroupFilterContainer';
import LocationFilterContainer from './Location/LocationFilterContainer';
import MethodFilter from './Method/MethodFilterContainer';
import PriceFilterContainer from './Price/PriceFilterContainer';
import ReviewFilterContainer from './Review/ReviewFilterContainer';
import { IFilterOptions } from '@/types/types';

interface FilterListProps {
  filterOption: IFilterOptions;
  type: 'instructor' | 'class';
}

const FilterList = ({ filterOption, type }: FilterListProps) => {
  const { setIsScrolling, isfilterModalOpen, setIsfilterModalOpen } =
    usefilterStore((state) => ({
      setIsScrolling: state.setIsScrolling,
      isfilterModalOpen: state.isfilterModalOpen,
      setIsfilterModalOpen: state.setIsfilterModalOpen,
    }));
  const { scrollContainerRef } = useTouchScroll({
    onChangeFn: () => setIsScrolling((prev) => !prev),
  });

  const modalCloseHandler = () => {
    setIsfilterModalOpen(false);
  };

  const filterComponents =
    type === 'class'
      ? [
          <LocationFilterContainer
            filterOption={filterOption.regions}
            key="location"
          />,
          <GenreFilterContainer
            filterOption={filterOption.genre}
            key="genre"
          />,
          <ReviewFilterContainer
            filterOption={filterOption.review}
            key="review"
          />,
          <PriceFilterContainer
            filterOption={filterOption.price!}
            key="price"
          />,
          <DateFilterContainer filterOption={filterOption.date!} key="date" />,
          <GroupFilterContainer
            filterOption={filterOption.group!}
            key="group"
          />,
          <MethodFilter filterOption={filterOption.method!} key="method" />,
          <DayTimeFilter filterOption={filterOption.daytime!} key="daytime" />,
        ]
      : [
          <LocationFilterContainer
            filterOption={filterOption.regions}
            key="location"
          />,
          <GenreFilterContainer
            filterOption={filterOption.genre}
            key="genre"
          />,
          <ReviewFilterContainer
            filterOption={filterOption.review}
            key="review"
          />,
        ];

  return (
    <>
      <div className="relative ">
        <div
          className="z-20 mb-3 flex w-full items-center gap-2 overflow-x-auto pb-2 pr-28"
          ref={scrollContainerRef}
        >
          {!isfilterModalOpen &&
            filterComponents.map((FilterComponent) => FilterComponent)}
          <Link
            href={type === 'instructor' ? '/instructor' : '/class'}
            className="hidden items-center whitespace-nowrap text-sm font-bold text-gray-300 lg:flex"
          >
            초기화
            <ResetSVG className="ml-1 h-[14px] w-[14px] fill-gray-500" />
          </Link>
          <Link
            href={type === 'instructor' ? '/instructor' : '/class'}
            className="absolute right-0 flex h-full items-center justify-center bg-white px-2 lg:hidden"
          >
            <ResetSVG className="ml-1 h-5 w-5 fill-gray-500" />
          </Link>
        </div>
      </div>
      {isfilterModalOpen && (
        <FilterMobileModal
          filterComponents={filterComponents}
          handleClosed={modalCloseHandler}
        />
      )}
    </>
  );
};

export default FilterList;
