import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useChangeSearchParams from './useChangeSearchParams';
import { PagenationFilterState } from '@/types/types';

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
  const queryClient = useQueryClient();
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [filterState, setFilterState] = useState(defaultFilterState);

  const searchParamsRef = useRef(false);

  const { changeMultipleParams, getCurrentParamsToObject } =
    useChangeSearchParams();

  const filterQueryParams = (filter: { [key: string]: any | undefined }) => {
    return Object.entries(filter)
      .filter(
        ([key, value]) =>
          key !== 'firstItemId' &&
          key !== 'lastItemId' &&
          key !== 'currentPage' &&
          value,
      )
      .map(([key, value]) => ({ name: key, value }));
  };

  const makeQueryKey = useCallback(
    (filter: { [key: string]: any | undefined }) =>
      filterQueryParams(filter).map(({ value }) => value),
    [],
  );

  const prevParams = getCurrentParamsToObject();

  const searchParams = Object.keys(prevParams).reduce<{
    [key: string]: any;
  }>((acc, key) => {
    const value = prevParams[key];
    acc[key] = !isNaN(value) && value !== '' ? +value : value;
    return acc;
  }, {});

  const initialDataQueryKey = makeQueryKey(defaultFilterState);

  const searchParamsKey = makeQueryKey(searchParams);

  const queryKey = useMemo(() => {
    return makeQueryKey(filterState);
  }, [filterState, makeQueryKey]);

  const { data, isLoading } = useQuery<{ count: number; item: T[] }>({
    queryKey: [queryType, ...queryKey],
    queryFn: ({ signal }) => queryFn(filterState, signal),
    staleTime,
    initialData: () => {
      if (
        initialData &&
        filterState.targetPage === 1 &&
        JSON.stringify(initialDataQueryKey) === JSON.stringify(queryKey) &&
        JSON.stringify(initialDataQueryKey) === JSON.stringify(searchParamsKey)
      ) {
        return initialData;
      }
    },
  });

  useEffect(() => {
    if (!data) return;

    changeMultipleParams(filterQueryParams(filterState), false);

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
