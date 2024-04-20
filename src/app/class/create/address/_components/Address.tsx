'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { searchAddress } from '@/lib/apis/searchAddress';
import AddressDescription from './AddressDescription';
import AddressLoading from './loading/AddressLoading';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Pagination from '@/components/Pagination/Pagination';
import { AddressData } from '@/types/address';

const Address = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [inputAddress, setInputAddress] = useState('');

  const queryClient = useQueryClient();

  const { data: addressData, isLoading } = useQuery<AddressData>({
    queryKey: ['searchAddress', inputAddress, currentPage],
    queryFn: ({ signal }) => searchAddress(inputAddress, currentPage, signal),
    enabled: !!inputAddress,
  });

  const addressSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const value = formData.get('inputAddress') as string;

    if (value) {
      setInputAddress(value);
    }
  };

  const handlePageChange = async ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    queryClient.cancelQueries({ queryKey: ['searchAddress'] });
  };

  return (
    <>
      <header className="m-auto h-20 w-full max-w-2xl px-3 sm:px-11 ">
        <h1 className="pt-8 text-2xl font-semibold">주소 검색</h1>
      </header>
      <hr className="border-t-1 mb-7 w-full border-solid border-gray-300" />

      <section className="m-auto mb-5 flex w-full max-w-2xl flex-col px-3 sm:mb-0 sm:px-11">
        <SearchForm addressSearch={addressSearch} />

        {isLoading ? (
          <AddressLoading />
        ) : addressData ? (
          <SearchResults addressData={addressData} />
        ) : (
          <AddressDescription />
        )}

        {addressData && addressData.results.common.errorCode === '0' && (
          <Pagination
            pageCount={Math.ceil(
              parseInt(addressData.results.common.totalCount) /
                parseInt(addressData.results.common.countPerPage),
            )}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </>
  );
};

export default Address;
