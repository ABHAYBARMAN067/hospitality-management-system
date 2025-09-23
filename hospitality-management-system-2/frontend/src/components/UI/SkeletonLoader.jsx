const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  );
};

const RestaurantCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <SkeletonLoader className="h-48 w-full mb-4" />
      <SkeletonLoader className="h-6 w-3/4 mb-2" />
      <SkeletonLoader className="h-4 w-1/2 mb-2" />
      <SkeletonLoader className="h-4 w-2/3 mb-4" />
      <SkeletonLoader className="h-10 w-full" />
    </div>
  );
};

export { SkeletonLoader, RestaurantCardSkeleton };
