import { useQuery } from '@tanstack/react-query';
import { ChangeEvent } from 'react';
import {
  INCOME_HISTORY_TAKE,
  MYPAGE_FILTER_OPTIONS,
} from '@/constants/constants';
import usePageNation from '@/hooks/usePageNation';
import { getTotalIncome, getIncomeHistory } from '@/lib/apis/incomeApis';
import IncomeRange from './IncomeRange';
import IncomeSelectClass from './IncomeSelectClass';
import IncomeTable from './IncomeTable';
import IncomeHistoryTableLoading from './Loading/IncomeHistoryTableLoading';
import { initialDateObject } from '../_lib/initialDate';
import Pagination from '@/components/Pagination/Pagination';
import { ILecturerPayment } from '@/types/payment';

const IncomeDataViewer = () => {
  const { from, to } = initialDateObject();

  const {
    items: incomeHistoryList,
    isLoading: historyLoading,
    totalItemCount,
    filterState,
    changeFilterState,
    changePage,
  } = usePageNation<ILecturerPayment>({
    defaultFilterState: {
      take: INCOME_HISTORY_TAKE,
      targetPage: 1,
      startDate: from.toISOString().split('T')[0],
      endDate: to.toISOString().split('T')[0],
      productType: MYPAGE_FILTER_OPTIONS.All,
      lectureId: undefined,
    },
    queryType: 'incomeHistory',
    queryFn: getIncomeHistory,
  });

  const { data: totalAmount, isLoading: totalAmountLoading } = useQuery({
    queryKey: [
      'income',
      'amount',
      filterState.endDate,
      filterState.startDate,
      filterState.productType,
    ],
    queryFn: () =>
      getTotalIncome(
        new Date(filterState.startDate),
        new Date(filterState.endDate),
        filterState.productType,
        filterState.lectureId,
      ),
  });

  const pageCount = Math.ceil(
    totalItemCount / (filterState.take ?? INCOME_HISTORY_TAKE),
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeFilterState({ lectureId: event.target.value });
  };

  const handleDisplayCount = (event: ChangeEvent<HTMLSelectElement>) => {
    const newDisplayCount = Number(event.target.value);
    changeFilterState({ take: newDisplayCount });
  };

  const handlePageChange = async (selected: { selected: number }) => {
    changePage(selected);
  };

  const handleSetRange = (newRange: { from: Date; to: Date }) => {
    changeFilterState({
      startDate: newRange.from.toISOString().split('T')[0],
      endDate: newRange.to.toISOString().split('T')[0],
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.id as MYPAGE_FILTER_OPTIONS;

    if (Object.values(MYPAGE_FILTER_OPTIONS).includes(option)) {
      changeFilterState({ productType: option });
    }
  };

  return (
    <section className="z-0 w-full rounded-lg bg-white shadow-float lg:col-span-2">
      <div className="flex flex-col gap-2.5 whitespace-nowrap border-b border-solid border-gray-700 px-4 py-5">
        {/* 조회 기간 선택 */}
        <IncomeRange
          handleSetRange={handleSetRange}
          startDate={filterState.startDate}
          endDate={filterState.endDate}
        />

        {/* 전체, 클래스, 패스권 필터링 */}
        <div className="flex gap-4 text-sm">
          <ul className="flex gap-4 font-medium">
            {Object.values(MYPAGE_FILTER_OPTIONS).map((option) => (
              <li key={option} className="flex items-center gap-[0.31rem]">
                <input
                  type="checkbox"
                  id={option}
                  checked={filterState.productType === option}
                  onChange={handleCheckboxChange}
                  className="h-[18px] w-[18px] accent-sub-color1"
                />
                <label htmlFor={option}> {option}</label>
              </li>
            ))}
          </ul>

          {/* 특정 클래스 선택하기 */}
          <IncomeSelectClass
            lectureId={filterState.lectureId}
            handleChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full px-4">
        {historyLoading || totalAmountLoading ? (
          <IncomeHistoryTableLoading take={filterState.take} />
        ) : (
          <IncomeTable
            data={incomeHistoryList}
            selectedOption={filterState.productType}
            displayCount={filterState.take ?? INCOME_HISTORY_TAKE}
            handleDisplayCount={handleDisplayCount}
          >
            <div className="flex gap-5 text-gray-100">
              <p>총 {totalItemCount}건</p>
              <p>
                총 금액
                <span className="ml-1 font-bold">
                  {totalAmount?.toLocaleString()}원
                </span>
              </p>
            </div>
          </IncomeTable>
        )}
      </div>

      {pageCount > 0 && (
        <nav className="z-0 mb-5 w-full">
          <Pagination
            pageCount={pageCount}
            currentPage={
              filterState.currentPage ? filterState.currentPage - 1 : 0
            }
            onPageChange={handlePageChange}
          />
        </nav>
      )}
    </section>
  );
};

export default IncomeDataViewer;
