import React from 'react';

const PassLoading = () => {
  return (
    <div className="h-full w-full animate-pulse overflow-hidden rounded-lg border border-solid border-gray-500">
      <div className="flex h-2/3 w-full flex-col gap-2 px-6 py-3">
        <div className="flex h-1/4 justify-between">
          <div className="h-full w-1/3 rounded-lg bg-gray-700" />
          <div className="h-full w-1/3 rounded-lg bg-gray-700" />
        </div>
        <div className="h-1/4 w-2/3 rounded-lg bg-gray-700" />
        <div className="h-1/4 w-2/3 rounded-lg bg-gray-700" />
        <div className="h-1/4 w-2/3 rounded-lg bg-gray-700" />
      </div>
      <div className="flex h-1/3 w-full animate-pulse justify-between border-t border-gray-700 px-6 py-3">
        <div className="flex h-full w-1/3 items-center gap-2">
          <div className="size-full flex-grow animate-pulse rounded-full bg-gray-700" />
          <div className="h-1/2 w-2/3 rounded-lg bg-gray-700" />
        </div>
        <div className="h-full w-1/3 rounded-lg bg-gray-700" />
      </div>
    </div>
  );
};

export default PassLoading;
