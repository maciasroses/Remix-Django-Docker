import { Link, Outlet } from "@remix-run/react";
import { useCustomTranslation } from "~/hooks";

const Event = () => {
  const events = useCustomTranslation("events");
  return (
    <>
      <Link to="/home/events">
        <h1 className="text-4xl md:text-6xl text-center dark:text-white">
          {events.title}
        </h1>
      </Link>
      <p className="text-2xl md:text-xl text-center dark:text-white">
        {events.description}
      </p>
      <Outlet />
    </>
  );
};

export default Event;
