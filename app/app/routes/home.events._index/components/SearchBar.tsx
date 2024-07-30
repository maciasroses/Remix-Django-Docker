import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { useCustomTranslation } from "~/hooks";
import { Category, Location } from "~/interfaces";

interface SearchBarProps {
  params: {
    q: string;
    category: string;
    location: string;
  };
  categories: Category[];
  locations: Location[];
  handleChangeIsSearching: (isSearching: boolean) => void;
}

const SearchBar = ({
  params,
  categories,
  locations,
  handleChangeIsSearching,
}: SearchBarProps) => {
  const { searchBar } = useCustomTranslation("events");
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  const categoryFiltering =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("category");
  const locationFiltering =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("location");

  //   const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
  //     const form = event.currentTarget;
  //     const formData = new FormData(form);

  //     interface Query {
  //       q?: string;
  //       category?: string;
  //       location?: string;
  //     }

  //     const query: Query = {};
  //     if (formData.get("q")) {
  //       query.q = formData.get("q") as string;
  //     }
  //     if (formData.get("category")) {
  //       query.category = formData.get("category") as string;
  //     }
  //     if (formData.get("location")) {
  //       query.location = formData.get("location") as string;
  //     }

  //     submit(form || (query as FormData), {
  //       replace: params.q === null,
  //     });
  //   };

  useEffect(() => {
    if (!searching || !categoryFiltering || !locationFiltering) {
      handleChangeIsSearching(false);
    } else {
      handleChangeIsSearching(true);
    }
  }, [
    searching,
    categoryFiltering,
    locationFiltering,
    handleChangeIsSearching,
  ]);

  return (
    <search>
      <Form
        id="search-form"
        className="max-w-lg mx-auto mt-6"
        // onChange={handleChange}
        onChange={(event) => {
          const isFirstSearch =
            params.q === null &&
            params.category === null &&
            params.location === null;
          submit(event.currentTarget, {
            replace: !isFirstSearch,
          });
        }}
        role="search"
      >
        <div className="flex flex-col md:flex-row">
          <select
            id="category"
            aria-label="Category"
            defaultValue={params.category || ""}
            name="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">{searchBar.filters.categories.mainOption}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            id="location"
            aria-label="Location"
            defaultValue={params.location || ""}
            name="location"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">{searchBar.filters.locations.mainOption}</option>
            {locations.map((location) => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>

          <div className="relative w-full">
            <input
              id="q"
              aria-label="Search events"
              defaultValue={params.q || ""}
              placeholder={searchBar.search}
              type="search"
              name="q"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            />
            <div
              role="status"
              aria-hidden="true"
              hidden={!searching || !categoryFiltering || !locationFiltering}
              className="absolute right-[2rem] top-[0.80rem]"
            >
              <svg
                aria-hidden="true"
                className="size-[1rem] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </Form>
    </search>
  );
};

export default SearchBar;
