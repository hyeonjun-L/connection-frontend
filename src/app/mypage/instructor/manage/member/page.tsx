import { redirect } from 'next/navigation';
import { MEMBER_MANAGE_TAKE } from '@/constants/constants';
import { getMyLecture } from '@/lib/apis/serverApis/classApi';
import { getMyMembers } from '@/lib/apis/serverApis/instructorPostApis';
import MemberManage from './_components/MemberManage';
import { OptionType } from '@/types/coupon';
import { GetMyMembersData } from '@/types/instructor';
import { FetchError } from '@/types/types';

const page = async ({
  searchParams,
}: {
  searchParams: {
    take: number;
    sortOption: 'LATEST' | 'ASC' | 'HIGHEST_APPLICANTS';
    filterOption: 'ALL' | 'IN_PROGRESS' | 'COMPLETED';
    lectureId: number;
  };
}) => {
  let myClassListsOption: OptionType[] = [];
  let myMembers: GetMyMembersData = {
    count: 0,
    item: [],
  };
  const { take, sortOption, filterOption, lectureId } = searchParams;

  const firstRender = {
    take: take ?? MEMBER_MANAGE_TAKE,
    sortOption: sortOption ?? 'LATEST',
    filterOption: filterOption ?? 'ALL',
    lectureId,
  };

  try {
    const [resMyMembers, resLectureLists] = await Promise.all([
      getMyMembers(firstRender),
      getMyLecture(),
    ]);

    myMembers = {
      ...myMembers,
      ...resMyMembers,
      item: resMyMembers.item.filter((data) => data.reservation),
    }; // 백엔드 데이터 정리 후 추후 제거
    // myMembers = { ...resMyMembers };

    myClassListsOption = resLectureLists.map(
      ({ id, title }): OptionType => ({
        value: id,
        label: title,
      }),
    );

    myClassListsOption.length > 0 &&
      myClassListsOption.unshift({
        value: '',
        label: `전체 클래스(${myClassListsOption.length})`,
      });
  } catch (error) {
    if (error instanceof Error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 400) {
        redirect('/mypage/instructor/manage/member');
      }
      console.error(error);
    }
  }

  return (
    <MemberManage
      myMembers={myMembers}
      myClassListsOption={myClassListsOption}
    />
  );
};

export default page;
