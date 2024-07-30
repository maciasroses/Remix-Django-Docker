import { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { FunctionComponent } from "react";
import { LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { Card404 } from "~/components";
import { Category, Event, User } from "~/interfaces";
import { useAuth } from "~/providers/AuthContext";
import { changeFavorite, getEvent } from "~/services/event.server";

const HeartFilled = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-8 md:size-12 text-red-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

const HeartEmpty = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-8 md:size-12 text-gray-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.id, "No id provided");
  const formData = await request.formData();
  const favorite = formData.get("favorite") === "true";
  return await changeFavorite(request, params.id, favorite);
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "No id provided");
  const event = await getEvent(request, params.id);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
};

const EventId = () => {
  const { user } = useAuth();
  const { event } = useLoaderData<typeof loader>();

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 mt-4">
      <img
        className="object-cover w-full md:w-1/2 rounded-t-lg h-96 md:h-full md:rounded-none md:rounded-s-lg"
        src="https://www.brides.com/thmb/d-DKhlZQB_8QoSh3VftNg0GomnM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__brides__public__brides-services__production__2017__04__20__58f8d71dcbe5800cd3d7c280_1-fa8ab72933c348f0951764c253ca8373.jpg"
        alt="event example"
      />
      <div className="relative w-full md:w-1/2">
        <div className="flex h-full flex-col justify-center items-start leading-normal">
          <h5 className="mb-2 text-2xl md:text-4xl xl:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            {event.title}
          </h5>
          <p className="mb-3 text-base md:text-xl xl:text-3xl font-normal text-gray-700 dark:text-gray-400">
            {event.description}
          </p>
          <div className="flex">
            {event.categories.map((category: Category) => (
              <span
                key={category.id}
                className="bg-blue-100 text-blue-800 text-sm md:text-lg xl:text-2xl font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 border border-blue-300"
              >
                {category.name}
              </span>
            ))}
          </div>
          <span className="bg-green-100 text-green-800 mt-2 text-sm md:text-lg xl:text-2xl font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
            <svg
              className="size-4 md:size-6 l:size-8 me-1.5"
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
        </div>

        <Favorite event={event} user={user} />
      </div>
    </div>
  );
};

export default EventId;

const Favorite: FunctionComponent<{ event: Event; user: User | null }> = ({
  event,
  user,
}) => {
  const fetcher = useFetcher();
  const isFavorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : event.users.some((eventUser: User) => eventUser.id === user?.id);

  return (
    <div className="absolute top-0 right-0">
      <fetcher.Form method="POST">
        <button
          className="flex items-center gap-2"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          name="favorite"
          value={isFavorite ? "false" : "true"}
        >
          {isFavorite ? <HeartFilled /> : <HeartEmpty />}
        </button>
      </fetcher.Form>
    </div>
  );
};

export function ErrorBoundary() {
  return (
    <div className="flex justify-center items-center">
      <Card404 title="Not found" description="This event was not found" />
    </div>
  );
}
