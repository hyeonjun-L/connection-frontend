'use client';
import { useState } from 'react';
import { ArrowUpSVG } from '@/icons/svg';

interface ReadMoreProps {
  labelName: string;
  id?: string;
}

const ReadMore = ({ labelName, id = 'more-btn' }: ReadMoreProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <input
        id={id}
        type="checkbox"
        onChange={(e) => {
          setIsChecked(e.target.checked);
        }}
        className="more-btn peer appearance-none"
      />
      <label
        htmlFor={id}
        className={`absolute -bottom-4 flex h-28 w-full cursor-pointer items-end justify-center ${
          isChecked ? '' : 'bg-gradient-to-t from-white from-30%'
        } text-center text-lg font-bold text-sub-color1`}
      >
        {isChecked ? (
          <p className="flex items-center">
            접기
            <ArrowUpSVG width="34" height="34" className="fill-sub-color1" />
          </p>
        ) : (
          <p className="underline">{labelName}</p>
        )}
      </label>
    </>
  );
};

export default ReadMore;
