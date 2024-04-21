const NotificationLoading = () => {
  return (
    <div className="w-full rounded-md bg-white px-4 py-3 shadow-float">
      <div className="mb-4 flex justify-between gap-3">
        <div className="h-7 w-full animate-pulse bg-gray-700" />
        <div className=" size-7 animate-pulse rounded-full bg-gray-700" />
      </div>
      <div className="mb-2 h-7 w-full animate-pulse bg-gray-700" />
      <div className="h-7 w-full animate-pulse bg-gray-700" />
    </div>
  );
};

export default NotificationLoading;
