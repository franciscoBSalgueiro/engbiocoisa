import { useState } from "react";
import StarIcon from "./StarIcon";

const StarRating = ({
  label,
  rating,
  setRating,
}: {
  label: string;
  rating: number;
  setRating: (rating: number) => void;
}) => {
  const handleClick = (value: number) => {
    setRating(value);
  };
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };
  const handleMouseLeave = () => {
    setHoverRating(null);
  };
  return (
    <>
      <p>{label}</p>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const value = i + 1;
          return (
            <button
              type="button"
              key={value}
              className={`w-5 h-5 mx-1 ${
                value <= rating ? "text-yellow-500" : "text-gray-200"
              } ${
                hoverRating && value <= hoverRating && rating < value
                  ? "text-yellow-300"
                  : ""
              } focus:outline-none`}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={() => handleMouseLeave()}
            >
              <StarIcon />
            </button>
          );
        })}
      </div>
    </>
  );
};

export default StarRating;
