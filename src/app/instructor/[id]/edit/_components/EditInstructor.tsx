'use client';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { INSTRUCTOR_EDIT_SECTIONS } from '@/constants/constants';
import { deleteImage } from '@/lib/apis/imageApi';
import { updateInstructor } from '@/lib/apis/instructorPostApis';
import {
  categorizeGenres,
  reqRegions,
  uploadImageFilesWithFallback,
} from '@/utils/apiDataProcessor';
import InstructorIntroduction from '../../../apply/_components/InstructorIntroduction';
import { Button, UniqueButton } from '@/components/Button';
import Nav from '@/components/Nav/Nav';
import ValidationMessage from '@/components/ValidationMessage/ValidationMessage';
import { InstructorApplyData } from '@/types/instructor';
import { ErrorMessage } from '@/types/types';

const EditInstructor = ({ defaultData }: { defaultData: any }) => {
  const formMethods = useForm<InstructorApplyData>({ shouldFocusError: false });
  const [invalidData, setInvalidData] = useState<null | ErrorMessage[]>(null);
  const router = useRouter();
  const { handleSubmit } = formMethods;

  const closeValidationMessage = () => {
    setInvalidData(null);
  };

  const onSubmit = async (data: InstructorApplyData) => {
    try {
      const {
        profileImageUrls,
        genres,
        regions,
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

      const uploadImgList = await uploadImageFilesWithFallback(
        profileImageUrls,
        'lecturers',
      );

      introduction.deletedImages.forEach(
        async ({ src }) => await deleteImage({ imageUrl: src }),
      );

      if (introduction.clear && introduction.deletedImages.length > 0) {
        introduction.clear();
      }

      experience.deletedImages.forEach(
        async ({ src }) => await deleteImage({ imageUrl: src }),
      );

      if (experience.clear && experience.deletedImages.length > 0) {
        experience.clear();
      }

      const { newGenres, etcGenres } = categorizeGenres(genres);

      const newRegions = reqRegions(regions);

      const instructorData = {
        newProfileImageUrls: uploadImgList,
        etcGenres,
        genres: newGenres,
        regions: newRegions,
        profileCardImageUrl: uploadImgList[0], //추후 강사 프로필 이미지 넣는 곳 생기면 수정
        youtubeUrl,
        instagramUrl,
        homepageUrl,
        affiliation,
        introduction: introduction.content,
        experience: experience.content,
        instagramPostUrls: [
          instagramPostUrls0,
          instagramPostUrls1,
          instagramPostUrls2,
        ],
      };

      await updateInstructor(instructorData);
      toast.success('강사 프로필 수정 완료');
      router.push(`/instructor/${defaultData.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error('잠시 후 다시 시도해 주세요');
      }
    }
  };

  const invalid = (data: Record<string, any>) => {
    const invalidList = Object.entries(data).map(([key, value]) => ({
      key,
      ...value,
    }));

    setInvalidData(invalidList);
  };

  const handleEditCancel = () => {
    const confirm = window.confirm('프로필 수정을 취소하겠습니까?');
    if (confirm) {
      router.push(`/instructor/${defaultData.id}`);
    }
  };

  return (
    <>
      <h1 className="mb-6 mt-3 text-2xl font-bold">프로필 수정</h1>

      <div className="w-full text-sm font-bold text-gray-500 sm:text-xl [&>*:nth-child(1)]:justify-evenly">
        <Nav sections={INSTRUCTOR_EDIT_SECTIONS} />
      </div>

      <FormProvider {...formMethods}>
        <InstructorIntroduction defaultData={defaultData} />
      </FormProvider>
      <form
        className="flex w-full flex-col gap-2 text-lg font-semibold"
        onSubmit={handleSubmit(onSubmit, invalid)}
      >
        <Button type="submit" color="secondary" size="large">
          수정 완료
        </Button>

        <UniqueButton color="secondary" size="large" onClick={handleEditCancel}>
          수정 취소
        </UniqueButton>
      </form>
      <ValidationMessage
        title="하기 값(들)을 확인해 주세요."
        closeModal={closeValidationMessage}
        invalidData={invalidData}
      />
    </>
  );
};

export default EditInstructor;
