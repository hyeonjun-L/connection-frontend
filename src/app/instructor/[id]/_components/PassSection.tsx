import { INSTRUCTOR_H2_STYLE } from '@/constants/constants';
import { getLecturerPassList } from '@/lib/apis/serverApis/passApis';
import CarouselContainer from '@/components/Carousel/CarouselContainer';
import UserPass from '@/components/Pass/UserPass';

const PassSection = async ({ id }: { id: string }) => {
  const passLists = await getLecturerPassList(id);

  if (passLists === undefined) {
    return null;
  }

  return (
    <section className="mb-14 flex w-full flex-col items-center px-5 pt-20 sm:px-0">
      <div className="w-full ">
        <h2 className={INSTRUCTOR_H2_STYLE}>패스권 {passLists.length}개</h2>
      </div>
      <div className="relative flex h-60 w-full justify-center ">
        {passLists.length > 0 && (
          <CarouselContainer
            move={true}
            showCurrentElement={false}
            carouselMoveIntervalTime={3000}
            priority={3}
            gap={32}
            mobileShowCurrentElement={false}
            itemStyle="w-72 sm:w-80"
            carouselContainerStyle="flex h-full w-11/12 items-center overflow-hidden"
          >
            {passLists.map((passInfo) => (
              <UserPass
                key={passInfo.id}
                passInfo={{
                  ...passInfo,
                  appliedList: passInfo.lecturePassTarget.map(
                    ({ lecture }) => ({
                      ...lecture,
                    }),
                  ),
                }}
              />
            ))}
          </CarouselContainer>
        )}
      </div>
    </section>
  );
};

export default PassSection;
