import React from "react";

export const HeaderButtonSkeleton = () => (
  <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
);

const HeaderSkeleton = () => {
  return (
    <div className="hidden md:flex items-center gap-2">
      <HeaderButtonSkeleton />
      <HeaderButtonSkeleton />
    </div>
  );
};

export default HeaderSkeleton; 