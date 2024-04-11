import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { PagenationFilterState } from '@/types/types';

interface usePageNationProps {
  defaultFilterState: PagenationFilterState;
  queryType: string;
  queryFn: (
    data: PagenationFilterState,
  ) => Promise<{ count: number; item: any[] }>;
  initialData?: any;
}

const usePageNation = ({
  queryType,
  defaultFilterState,
  queryFn,
}: usePageNationProps) => {
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
    queryFn: () => queryFn(filterState),
    staleTime: Infinity,
  });

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      firstItemId: data?.item[0]?.id ?? 0,
      lastItemId: data?.item.at(-1).id ?? 0,
    }));

    setTotalItemCount((prev) => data?.count ?? prev);
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
      currentPage: filterState.targetPage,
      targetPage: selected,
    }));
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
