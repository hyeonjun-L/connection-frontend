'use client';
import dynamic from 'next/dynamic';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import {
  MYPAGE_FILTER_OPTIONS,
  PAYMENT_HISTORY_TAKE,
} from '@/constants/constants';
import usePageNation from '@/hooks/usePageNation';
import { getPaymentHistory } from '@/lib/apis/paymentApis';
import EmptyData from './_components/EmptyData';
import Pagination from '@/components/Pagination/Pagination';
import PageSizeSelector from '@/components/Selector/PageSizeSelector';
import Spinner from '@/components/Spinner/Spinner';
import { IMyPayment } from '@/types/payment';

const PaymentList = dynamic(() => import('./_components/PaymentList'), {
  ssr: false,
});

const PaymentHistory = () => {
  const {
    items: paymentHistoryList,
    totalItemCount,
    filterState,
    isLoading,
    changeFilterState,
    changePage,
  } = usePageNation<IMyPayment>({
    queryType: 'user-payment',
    defaultFilterState: {
      take: PAYMENT_HISTORY_TAKE,
      paymentHistoryType: '전체',
      targetPage: 1,
    },
    queryFn: getPaymentHistory,
  });

  if (isLoading || !paymentHistoryList)
    return (
      <div className="mx-auto mt-3 w-full max-w-[40rem] px-4 xl:mx-0">
        <h1 className="mb-2.5 border-b border-solid border-gray-700 pb-2.5 text-2xl font-bold text-gray-100">
          결제내역
        </h1>
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      </div>
    );

  const pageCount = Math.ceil(
    totalItemCount / (filterState.take ?? PAYMENT_HISTORY_TAKE),
  );

  const handleDisplayCount = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = Number(event.target.value);

    changeFilterState({ take: newCount });
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newOption = event.target.id as MYPAGE_FILTER_OPTIONS;

    changeFilterState({ paymentHistoryType: newOption }, true);
  };

  const handlePaymentDelete = () => {
    const userConfirmed = window.confirm(
      '삭제내역은 복구할 수 없습니다. 정말로 삭제하겠습니까?',
    );
    if (userConfirmed) {
      // TO DO: API 처리
      toast.success('결제내역이 삭제되었습니다!');
    }
  };

  return (
    <section className="mx-auto mt-3 w-full max-w-[40rem] px-4 xl:mx-0">
      <h1 className="mb-2.5 border-b border-solid border-gray-700 pb-2.5 text-2xl font-bold text-gray-100">
        결제내역
      </h1>

      <div className="mb-4 flex justify-between gap-4 text-sm">
        <ul className="flex gap-4 whitespace-nowrap font-medium">
          {Object.values(MYPAGE_FILTER_OPTIONS).map((option) => (
            <li key={option} className="flex items-center gap-[0.31rem]">
              <input
                type="checkbox"
                id={option}
                checked={filterState.paymentHistoryType === option}
                onChange={handleCheckboxChange}
                className="h-[18px] w-[18px] cursor-pointer accent-sub-color1"
              />
              <label htmlFor={option} className="cursor-pointer">
                {option}
              </label>
            </li>
          ))}
        </ul>

        <PageSizeSelector
          value={filterState.take ?? PAYMENT_HISTORY_TAKE}
          onChange={handleDisplayCount}
        />
      </div>

      {totalItemCount > 0 ? (
        <div className="mb-4 flex flex-col gap-4">
          {paymentHistoryList.map((data) => (
            <PaymentList
              key={data.id}
              {...data}
              handlePaymentDelete={handlePaymentDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyData selectedOption={filterState.paymentHistoryType} />
      )}

      {pageCount > 0 && (
        <nav className="z-0">
          <Pagination
            pageCount={pageCount}
            currentPage={
              filterState.currentPage ? filterState.currentPage - 1 : 0
            }
            onPageChange={changePage}
          />
        </nav>
      )}
    </section>
  );
};

export default PaymentHistory;
