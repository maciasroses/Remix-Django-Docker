import { Link } from "@remix-run/react";
import { Event } from "~/interfaces";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link
      to={event.id}
      className="w-full flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-full md:w-48 md:rounded-none md:rounded-s-lg"
        src="https://www.brides.com/thmb/d-DKhlZQB_8QoSh3VftNg0GomnM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__brides__public__brides-services__production__2017__04__20__58f8d71dcbe5800cd3d7c280_1-fa8ab72933c348f0951764c253ca8373.jpg"
        alt="event example"
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {event.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {event.description}
        </p>
        <div className="flex lg:flex-col  gap-2">
          {event.categories.map((category) => (
            <span
              key={category.id}
              className=" bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 border border-blue-300"
            >
              {category.name}
            </span>
          ))}
        </div>
        <p className="mt-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
            <svg
              className="size-4 me-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            {event.location.name}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default EventCard;
