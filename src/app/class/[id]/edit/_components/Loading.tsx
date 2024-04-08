const Loading = () => (
  <div
    role="status"
    className="border-box mx-auto mt-5 box-border grid w-full grid-cols-1 gap-x-12 px-4 md:grid-cols-[1fr_3fr] md:gap-x-5 xl:grid-cols-[1fr_2fr_1fr] xl:px-0"
  >
    <div />
    <div className="mb-4 h-[475px] animate-pulse bg-gray-700" />
    <div className="hidden xl:block" />
    <div className="sticky top-0 hidden h-80 w-1/2 animate-pulse justify-self-center bg-gray-700 md:block" />
    <div className="h-screen w-full animate-pulse bg-gray-700" />
    <div />
  </div>
);

export default Loading;
