const PostItemSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md h-auto mb-2 animate-pulse">
      <div className="pt-5 px-5">
        {/* Image skeleton */}
        <div className="w-full h-[220px] bg-gray-200 rounded-lg"></div>
      </div>

      <div className="p-5">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Info row skeletons */}
        <div className="flex flex-col gap-3">
          {/* Date */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItemSkeleton;
