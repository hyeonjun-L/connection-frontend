import { Fragment } from 'react';

const AddressLoading = () => {
  return (
    <>
      <div className="mb-4 mt-7 h-7 w-12 animate-pulse bg-gray-700" />
      {Array.from({ length: 5 }, (_, index) => (
        <Fragment key={index}>
          <div className="flex flex-col gap-1">
            <div className="h-6 w-11 animate-pulse bg-gray-700" />
            <div className="h-6 w-2/3 animate-pulse bg-gray-700" />
            <div className="h-6 w-1/2 animate-pulse bg-gray-700" />
          </div>
          <hr className="border-t-1 my-4 w-full animate-pulse border-solid border-gray-700" />
        </Fragment>
      ))}
    </>
  );
};

export default AddressLoading;
