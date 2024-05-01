import React from 'react';
import { getLikesClassList } from '@/lib/apis/serverApis/classApi';
import { transformToCardData } from '@/utils/apiDataProcessor';
import InterrestedClass from './_components/InterrestedClass';

const page = async () => {
  const resLikesClassList = await getLikesClassList();

  if (!resLikesClassList) return;

  const cardDatas = transformToCardData(resLikesClassList);

  return <InterrestedClass cardDatas={cardDatas} />;
};

export default page;
