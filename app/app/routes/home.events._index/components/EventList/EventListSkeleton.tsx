import EventSkeletonCard from "./EventSkeletonCard";

const EventListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <EventSkeletonCard key={index} />
      ))}
    </div>
  );
};

export default EventListSkeleton;
