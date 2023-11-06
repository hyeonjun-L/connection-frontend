'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { instructorRegister } from '@/lib/apis/instructorApi';
import useStore from '@/store';
import {
  categorizeGenres,
  constructEmail,
  formatRegions,
  handleImageUpload,
} from '@/utils/apiDataPreparers';
import { switchToInstructor } from '@/utils/switchUserUtil';
import InstructorAuth from './_components/InstructorAuth';
import InstructorIntroduction from './_components/InstructorIntroduction';
import ValidationMessage from '@/components/ValidationMessage/ValidationMessage';
import { InstructorApplyData } from '@/types/instructor';
import { ErrorMessage } from '@/types/types';

const steps = [
  { title: '강사 인증', component: <InstructorAuth /> },
  { title: '강사 소개', component: <InstructorIntroduction /> },
];

const ApplyPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [invalidData, setInvalidData] = useState<null | ErrorMessage[]>(null);
  const formMethods = useForm({ shouldFocusError: false });
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); //새로고침 저장 안됨 안내 메시지

  const {
    handleSubmit,
    formState: { isValid },
  } = formMethods;

  const submit = async (data: InstructorApplyData) => {
    try {
      const {
        profileImageUrls,
        emailFront,
        emailBack,
        genres,
        regions,
        nickname,
        phoneNumber,
        youtubeUrl,
        instagramUrl,
        homepageUrl,
        affiliation,
        introduction,
        experience,
        instagramPostUrls0,
        instagramPostUrls1,
        instagramPostUrls2,
      } = data;

      const uploadImgList = await handleImageUpload(profileImageUrls);

      const email = constructEmail(emailFront, emailBack);

      const { newGenres, etcGenres } = categorizeGenres(genres);

      const newRegions = formatRegions(regions);

      const instructorData = {
        profileImageUrls: uploadImgList,
        email,
        nickname,
        etcGenres,
        genres: newGenres,
        regions: newRegions,
        phoneNumber,
        profileCardImageUrl: uploadImgList[0], //추후 강사 프로필 이미지 넣는 곳 생기면 수정
        youtubeUrl,
        instagramUrl,
        homepageUrl,
        affiliation,
        introduction,
        experience,
        instagramPostUrls: [
          instagramPostUrls0,
          instagramPostUrls1,
          instagramPostUrls2,
        ],
      };

      await instructorRegister(instructorData);

      toast.success('강사 등록 완료!');

      await switchToInstructor(store);

      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('잠시 후 다시 시도해 주세요');
      }
    }
  };

  const onValid = (data: any) => {
    activeStep === 1 ? submit(data) : nextStep();
  };

  const invalid = (data: Record<string, any>) => {
    const invalidList = Object.entries(data).map(([key, value]) => ({
      key,
      ...value,
    }));

    setInvalidData(invalidList);
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const closeValidationMessage = () => {
    setInvalidData(null);
  };

  return (
    <main className="mx-auto mb-28 flex w-full max-w-[40rem] flex-col items-center">
      <h1 className="my-3 text-2xl font-bold">강사등록</h1>
      {/* 상태 바 */}
      <ul className="flex h-[45px] w-full items-center justify-between whitespace-nowrap rounded-[3.13rem] text-lg font-bold shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex h-full flex-grow items-center justify-center gap-2 rounded-[3.13rem] px-1 ${
              activeStep === index
                ? 'bg-sub-color1 text-white'
                : 'text-sub-color2'
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                activeStep === index
                  ? 'bg-white text-sub-color1'
                  : 'bg-sub-color2 text-white'
              }`}
            >
              {index + 1}
            </span>
            {step.title}
          </li>
        ))}
      </ul>

      <FormProvider {...formMethods}>
        {steps[activeStep].component}
      </FormProvider>

      <form onSubmit={handleSubmit(onValid, invalid)} className="w-full">
        <button
          className={`h-9 w-full rounded-[0.31rem] text-white ${
            activeStep === 1 || isValid ? 'bg-sub-color1' : 'bg-sub-color2'
          }`}
          disabled={activeStep !== 1 && !isValid}
        >
          {activeStep === 1 ? '프로필 등록' : '다음'}
        </button>
      </form>
      {/* 추후 이전 버튼 구현 */}

      <ValidationMessage
        closeModal={closeValidationMessage}
        invalidData={invalidData}
      />
    </main>
  );
};

export default ApplyPage;
