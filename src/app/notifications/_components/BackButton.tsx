'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightSVG } from '@/icons/svg';

const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      <ArrowRightSVG className="size-7 rotate-180 stroke-gray-100 sm:hidden" />
    </button>
  );
};

export default BackButton;
