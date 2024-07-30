import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getEvents } from "~/services/event.server";
import { EventList, SearchBar } from "./components";
import { useEffect, useState } from "react";
import { getCategory } from "~/services/category.server";
import { getLocation } from "~/services/location.server";
import Pagination from "./components/Pagination";

interface SearchParams {
  q?: string;
  category?: string;
  location?: string;
  page?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const category = url.searchParams.get("category");
  const location = url.searchParams.get("location");
  const page = url.searchParams.get("page") || "1";

  const searchParams: SearchParams = {};
  if (q) searchParams.q = q;
  if (category) searchParams.category = category;
  if (location) searchParams.location = location;
  searchParams.page = page;

  const { results: events, total_pages } = await getEvents(
    request,
    searchParams
  );
  const categories = await getCategory(request);
  const locations = await getLocation(request);
  return json({
    events,
    total_pages,
    q,
    category,
    location,
    categories,
    locations,
  });
};

const EventIndex = () => {
  const [isSearching, setIsSearching] = useState(false);
  const { events, total_pages, q, category, location, categories, locations } =
    useLoaderData<typeof loader>();

  const paramsForSearch = {
    q: q || "",
    category: category || "",
    location: location || "",
  };

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) searchField.value = q || "";
    const categoryField = document.getElementById("category");
    if (categoryField instanceof HTMLSelectElement)
      categoryField.value = category || "";
    const locationField = document.getElementById("location");
    if (locationField instanceof HTMLSelectElement)
      locationField.value = location || "";
  }, [q, category, location]);

  const handleChangeIsSearching = (value: boolean) => {
    setIsSearching(value);
  };

  return (
    <>
      <SearchBar
        params={paramsForSearch}
        categories={categories}
        locations={locations}
        handleChangeIsSearching={handleChangeIsSearching}
      />
      <EventList events={events} isSeaching={isSearching} />
      {!isSearching && total_pages > 1 && (
        <Pagination totalPages={total_pages} />
      )}
    </>
  );
};

export default EventIndex;
