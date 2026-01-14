import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
      {/* Image Skeleton */}
      <div className="h-56 md:h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-3 animate-pulse"></div>

        {/* Subtitle Skeleton */}
        <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4 animate-pulse"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Features Skeleton */}
        <div className="flex gap-3 mb-5">
          <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Price Skeleton */}
        <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-5 animate-pulse"></div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
