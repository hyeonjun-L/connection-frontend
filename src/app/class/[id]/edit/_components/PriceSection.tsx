import { Controller, FieldErrors, FieldValues } from 'react-hook-form';
import NumberSelect from '../../../create/[id]/_components/NumberSelect';
import { IClassEditPageData } from '@/types/class';
import { CLASS_EDIT_STYLE } from '@/constants/constants';
import createOptions from '@/utils/generateStudentCountOptions';

interface PriceSectionProps {
  control: any;
  data: IClassEditPageData;
  errors: FieldErrors<FieldValues>;
}

const PriceSection = (props: PriceSectionProps) => {
  const { control, data, errors } = props;
  const { isGroup, price, maxCapacity } = data;

  return (
    <>
      {isGroup && (
        <div className={`flex ${CLASS_EDIT_STYLE.border} items-center py-4`}>
          <p className="mr-10 w-28">1회 최대 수강생</p>
          <Controller
            name="maxCapacity"
            control={control}
            defaultValue={{ value: maxCapacity, label: maxCapacity }}
            rules={{
              required: '최대 수강생',
            }}
            render={({ field }) => (
              <NumberSelect
                instanceId="maxCapacity"
                value={field.value}
                onChange={field.onChange}
                options={createOptions(maxCapacity, 100)}
              />
            )}
          />
          <div className="ml-1">명</div>
        </div>
      )}

      <div className="mb-10 flex py-4">
        <p
          id="price"
          className={`mr-10 w-28 ${
            errors.price && 'animate-vibration text-main-color'
          }`}
        >
          가격 설정
        </p>

        <Controller
          name="price"
          control={control}
          defaultValue={price}
          rules={{
            required: '가격',
            min: { value: 1, message: '올바른 가격' },
          }}
          render={({ field }) => (
            <div className="ml-1.5 text-gray-100">
              <span>1회당</span>
              <input
                type="number"
                className="ml-7 mr-1 h-8 w-24 rounded-md border border-solid border-gray-700 px-2 text-right focus:outline-sub-color1"
                defaultValue={field.value}
                onChange={field.onChange}
                aria-label="가격 설정"
              />
              <span>원</span>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default PriceSection;
