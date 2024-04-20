import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyLecture } from '@/lib/apis/classApi';

interface OptionType {
  value: number | string;
  label: string;
}

interface ILecture {
  id: number;
  title: string;
}

interface IncomeSelectClassProps {
  lectureId?: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const IncomeSelectClass = ({
  lectureId,
  handleChange,
}: IncomeSelectClassProps) => {
  const { data: classList, isLoading } = useQuery({
    queryKey: ['myClass'],
    queryFn: getMyLecture,
  });

  const myClassList: OptionType[] = useMemo(
    () =>
      classList?.map(({ id, title }: ILecture) => ({
        value: id,
        label: title,
      })) ?? [],
    [classList],
  );

  if (isLoading)
    return (
      <div className="h-7 w-full max-w-[24rem] animate-pulse rounded-md bg-gray-700" />
    );

  return (
    <select
      id="class"
      value={lectureId || ''}
      onChange={handleChange}
      className="h-7 w-full max-w-[24rem] rounded-md px-2 py-1 outline outline-1 outline-gray-500 focus:outline-sub-color1"
      aria-label="특정 클래스 선택하기"
    >
      <option value="" disabled className="text-gray-500">
        클래스를 선택해주세요
      </option>
      {myClassList?.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default IncomeSelectClass;
