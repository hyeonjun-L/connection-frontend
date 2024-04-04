import Image from 'next/image';
import errorImg from '@/images/ErrorImg.webp';

const ErrorMap = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <Image
        src={errorImg}
        alt="지도 데이터 오류 이미지"
        priority={true}
        className="h-auto w-auto flex-shrink object-cover"
      />
      <p>장소의 올바른 위치를 찾지 못했습니다.</p>
    </div>
  );
};

export default ErrorMap;
