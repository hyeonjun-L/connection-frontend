import React from 'react';
import { getLikesClassList } from '@/lib/apis/serverApis/classApi';
import { transformToCardData } from '@/utils/apiDataProcessor';
import ClassPreview from '@/components/ClassPreview/ClassPreview';
import { IClassPostResponse } from '@/types/class';

const page = async () => {
  const resLikesClassList = await getLikesClassList();

  if (!resLikesClassList) return;

  const cardData = transformToCardData(resLikesClassList);

  console.log(cardData);

  //   const likesClassList = transformToCardData(
  //     resLikesClassList.map(({ lecture }) => ({ ...lecture })),
  //     { nickname: 's', img: 's', id: 1 },
  //   );

  return <div>{/* <ClassPreview {...likesClassList[0]} />{' '} */}</div>;
};

export default page;
