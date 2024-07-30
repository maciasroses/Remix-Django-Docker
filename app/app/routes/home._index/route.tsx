import { useCustomTranslation } from "~/hooks";

const HomeIndex = () => {
  const home = useCustomTranslation("home");
  return (
    <>
      <h1 className="dark:text-white">{home.title}</h1>
    </>
  );
};

export default HomeIndex;
