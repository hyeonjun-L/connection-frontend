import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useChangeSearchParams from './useChangeSearchParams';
import { FetchError, PagenationFilterState } from '@/types/types';

/**
 * usePageNation 훅은 React Query를 사용하여 페이지네이션과 필터링을 관리
 * URL의 검색 파라미터와 동기화하여 사용자의 필터 상태를 관리하여 window history 이동에도 필터 상태 유지 가능 또한 페이지 상태를 쿼리 캐시 키와 함께 저장'
 *
 * @template T 확장된 ItemWithId 인터페이스를 가진 아이템 타입
 * @param {PagenationFilterState} defaultFilterState - 기본 필터 값. reset이 true로 설정될 경우, 이 값으로 필터가 변경
 * @param {string} queryType - 쿼리 캐시 키
 * @param {(data: any, signal?: AbortSignal) => Promise<{ count: number; item: T[] }>} queryFn - 페이지네이션 아이템과 아이템의 총 개수(count)를 받아올 함수.
 *  이 함수는 데이터와 선택적으로 AbortSignal을 매개변수로 받고, { count: number; item: T[] } 형태의 객체를 반환하는 Promise를 반환해야 함.
 * @param {{ count: number; item: T[] }} initialData - SSR(Server-Side Rendering)에서 사전에 가져올 데이터. SSR에서 searchParams에 따라 initialData가 변경되어야 함.
 * @param {number} staleTime - 캐시의 유효기간
 *
 * @return {T[]} items - 페이지네이션된 아이템 배열(T[])
 * @return {number} totalItemCount - 페이지네이션 아이템의 총 개수
 * @return {PagenationFilterState} filterState -  현재 페이지네이션 필터 값. 사용자가 설정한 필터 조건을 나타냄.
 * @return {(filter: { [key: string]: any;}, reset?: boolean) => void} changeFilterState - 필터 상태를 변경하는 함수.
 *  이 함수는 변경할 필터의 key와 value를 매개변수로 받고, 선택적으로 기본 필터 상태로 변경할지 여부를 결정하는 reset 매개변수를 가짐.
 * @return {({ selected }: {selected: number;}) => void} changePage - 페이지를 변경하는 함수. 이 함수는 이동할 페이지 값을 매개변수로 받음.
 */

interface ItemWithId {
  id: number;
}

interface usePageNationProps<T extends ItemWithId> {
  defaultFilterState: PagenationFilterState;
  queryType: string;
  queryFn: (
    data: any,
    signal?: AbortSignal,
  ) => Promise<{ count: number; item: T[] }>;
  initialData?: { count: number; item: T[] };
  staleTime?: number;
}

const usePageNation = <T extends ItemWithId>({
  queryType,
  defaultFilterState,
  queryFn,
  staleTime,
  initialData,
}: usePageNationProps<T>) => {
  const { changeMultipleParams, getCurrentParamsToObject, removeAllParams } =
    useChangeSearchParams();

  const prevParams = getCurrentParamsToObject();

  const filterQueryParams = (
    filter: { [key: string]: any | undefined },
    searchParams?: boolean,
  ) => {
    return Object.entries(filter)
      .filter(
        ([key, value]) =>
          key !== 'firstItemId' &&
          key !== 'lastItemId' &&
          key !== 'currentPage' &&
          (searchParams || value),
      )
      .map(([key, value]) => ({ name: key, value }));
  };

  const makeQueryKey = useCallback(
    (filter: { [key: string]: any | undefined }) =>
      filterQueryParams(filter).map(({ value }) => value),
    [],
  );

  const searchParams = Object.keys(prevParams).reduce<PagenationFilterState>(
    (acc, key) => {
      const value = prevParams[key];
      if (Object.keys(defaultFilterState).includes(key)) {
        acc[key] = !isNaN(value) && value !== '' ? +value : value;
      }
      return acc;
    },
    {} as PagenationFilterState,
  );

  const queryClient = useQueryClient();
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [filterState, setFilterState] = useState(
    Object.keys(searchParams).length === 0
      ? defaultFilterState
      : { ...searchParams, targetPage: 1 },
  );

  const initialDataFilterState = useRef<string[] | null>(null);
  const searchParamsRef = useRef(false);

  if (!searchParamsRef.current) {
    initialDataFilterState.current = makeQueryKey(searchParams);
  }

  const queryKey = useMemo(() => {
    return makeQueryKey(filterState);
  }, [filterState, makeQueryKey]);

  const { data, isLoading, error } = useQuery<{ count: number; item: T[] }>({
    queryKey: [queryType, ...queryKey],
    queryFn: ({ signal }) => queryFn(filterState, signal),
    staleTime,
    initialData: () => {
      if (
        initialData &&
        filterState.targetPage === 1 &&
        JSON.stringify(queryKey) ===
          JSON.stringify(initialDataFilterState.current)
      ) {
        return initialData;
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error instanceof Error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 400) {
        removeAllParams();
        setFilterState(defaultFilterState);
      }
    }
  }, [defaultFilterState, error, removeAllParams]);

  useEffect(() => {
    if (!data) return;

    changeMultipleParams(filterQueryParams(filterState, true), false);

    const updateStateWithCommonData = (prevState: PagenationFilterState) => ({
      ...prevState,
      currentPage: prevState.currentPage ? filterState.targetPage : 1,
      firstItemId: data.item[0]?.id ?? 0,
      lastItemId: data.item.at(-1)?.id ?? 0,
    });

    if (!searchParamsRef.current) {
      searchParamsRef.current = true;

      setFilterState((prev) => ({
        ...updateStateWithCommonData(prev),
        ...searchParams,
      }));
    } else {
      setFilterState(updateStateWithCommonData);
    }

    setTotalItemCount(data.count);
  }, [data]);

  const changeFilterState = (
    filter: { [key: string]: any },
    reset?: boolean,
  ) => {
    setFilterState((prevState) => {
      const commonState = {
        firstItemId: 0,
        lastItemId: 0,
        currentPage: 0,
        targetPage: 1,
        ...filter,
      };
      return reset
        ? { ...defaultFilterState, ...commonState }
        : { ...prevState, ...commonState };
    });
  };

  const changePage = ({ selected }: { selected: number }) => {
    setFilterState((prevState) => ({
      ...prevState,
      targetPage: selected + 1,
    }));

    queryClient.cancelQueries({ queryKey: [queryType] });
  };

  return {
    items: data?.item ?? [],
    totalItemCount,
    filterState,
    isLoading,
    changeFilterState,
    changePage,
  };
};

export default usePageNation;
