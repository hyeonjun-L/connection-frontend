import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { PagenationFilterState } from '@/types/types';

interface usePageNationProps {
  defaultFilterState: PagenationFilterState;
  queryType: string;
  queryFn: (
    data: any,
    signal?: AbortSignal,
  ) => Promise<{ count: number; item: any[] }>;
  initialData?: any;
  staleTime?: number;
}

const usePageNation = ({
  queryType,
  defaultFilterState,
  queryFn,
  staleTime = Infinity,
}: usePageNationProps) => {
  const queryClient = useQueryClient();

  const [totalItemCount, setTotalItemCount] = useState(0);
  const [filterState, setFilterState] = useState(defaultFilterState);

  const queryKey = useMemo(() => {
    return Object.entries(filterState)
      .filter(
        ([key, _]) =>
          key !== 'firstItemId' &&
          key !== 'lastItemId' &&
          key !== 'currentPage',
      )
      .map(([_, value]) => value);
  }, [filterState]);

  const { data, isLoading } = useQuery({
    queryKey: [queryType, ...queryKey],
    queryFn: ({ signal }) => queryFn(filterState, signal),
    staleTime,
  });

  useEffect(() => {
    if (!data) return;

    setFilterState((prev) => ({
      ...prev,
      currentPage: prev.currentPage ? filterState.targetPage : 1,
      firstItemId: data.item[0]?.id ?? 0,
      lastItemId: data.item.at(-1)?.id ?? 0,
    }));

    setTotalItemCount(data.count);
  }, [data]);

  const changeFilterState = (key: string, value: any, reset?: boolean) => {
    setFilterState((prevState) => {
      const commonState = {
        firstItemId: 0,
        lastItemId: 0,
        currentPage: 0,
        targetPage: 0,
        [key]: value,
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
