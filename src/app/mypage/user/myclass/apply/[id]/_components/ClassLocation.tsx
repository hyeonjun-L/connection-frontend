import { LocationSVG } from '@/icons/svg';
import { formatLocationToString } from '@/utils/parseUtils';
import AddressMap from '@/components/Map/AddressMap';
import AreaHighlightMap from '@/components/Map/AreaHighlightMap';
import { IApplyDetailResponse } from '@/types/class';

const ClassLocation = (props: IApplyDetailResponse) => {
  const { lecture } = props;
  const { location, region, locationDescription } = lecture;

  return (
    <section className="mt-5 text-sm">
      <h2 className="mb-1.5 flex items-center gap-1 text-base font-semibold">
        <LocationSVG width={21} height={21} className="fill-sub-color1" />
        진행 장소
        {!location && (
          <p className="ml-2 text-sm text-sub-color1">
            *정확한 위치는 강사에게 문의하세요
          </p>
        )}
      </h2>
      <p className="mb-2.5">
        {location ? location.detailAddress : formatLocationToString(region)}
      </p>
      <div className="h-[18.25rem] max-w-[40rem] bg-slate-100">
        {location ? (
          <AddressMap
            address={location.address}
            studioName={location.buildingName}
          />
        ) : (
          <AreaHighlightMap regions={region} />
        )}
      </div>
      {locationDescription && (
        <p className="mt-2 font-normal">{locationDescription}</p>
      )}
    </section>
  );
};

export default ClassLocation;
