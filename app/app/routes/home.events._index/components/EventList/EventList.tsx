import EventCard from "./EventCard";
import { Card404 } from "~/components";
import EventListSkeleton from "./EventListSkeleton";
import type { Event } from "~/interfaces";

interface EventListProps {
  events: Event[];
  isSeaching: boolean;
}

const EventList = ({ events, isSeaching }: EventListProps) => {
  return (
    <>
      {isSeaching ? (
        <EventListSkeleton />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card404
          title="Not found"
          description="Events were not found with this search"
        />
      )}
    </>
  );
};

export default EventList;
