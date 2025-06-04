const PostSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column skeleton */}
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col gap-4">
          {/* Main Image skeleton */}
          <div className="bg-gray-200 rounded-2xl aspect-square"></div>
          
          {/* User Image skeleton */}
          <div className="bg-white flex gap-2 items-center p-4 shadow-lg rounded-2xl">
            <div className="bg-gray-200 rounded-full w-[50px] h-[50px]"></div>
            <div className="flex flex-col gap-2">
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
              <div className="bg-gray-200 h-6 w-32 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="w-full md:w-[60%] lg:w-[65%]">
          <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
          
          {/* Date skeleton */}
          <div className="flex items-center gap-2 py-2">
            <div className="bg-gray-200 w-14 h-14 rounded-lg"></div>
            <div className="bg-gray-200 h-6 w-40 rounded"></div>
          </div>

          {/* Time skeleton */}
          <div className="flex items-center gap-2 py-2">
            <div className="bg-gray-200 w-14 h-14 rounded-lg"></div>
            <div className="bg-gray-200 h-6 w-32 rounded"></div>
          </div>

          {/* Location skeleton */}
          <div className="flex items-center gap-2 py-2">
            <div className="bg-gray-200 w-14 h-14 rounded-lg"></div>
            <div className="bg-gray-200 h-6 w-56 rounded"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mt-4">
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton; 