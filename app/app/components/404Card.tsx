import { useNavigate } from "@remix-run/react";

interface Card404Props {
  title: string;
  description: string;
}

const Card404 = ({ title, description }: Card404Props) => {
  const navigate = useNavigate();
  return (
    <div className="p-4 text-center dark:text-white">
      <p className="text-5xl pb-4">X</p>
      <strong className="text-3xl">{title}</strong>
      <p className="text-2xl">{description}</p>
      <button
        className="text-lg text-blue-600 pt-2"
        onClick={() => navigate(-1)}
        type="button"
      >
        Go back
      </button>
    </div>
  );
};

export default Card404;
