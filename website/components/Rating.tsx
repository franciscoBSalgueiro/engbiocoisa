import StarIcon from "./StarIcon";

function Rating({ rating }: { rating: number }) {
  const filledStars = Math.floor(rating);
  const percentage = rating - filledStars;

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < filledStars) {
          // fully filled star
          return (
            <div key={i} className="w-4 h-4 text-yellow-500">
              <StarIcon />
            </div>
          );
        } else if (i === filledStars) {
          // partially filled star
          return (
            <div key={i} className="w-4 h-4 relative">
              <div className="absolute w-4 h-4 overflow-hidden">
                <div className="w-4 h-4 text-gray-300">
                  <StarIcon />
                </div>
              </div>
              <div className="absolute w-4 h-4 overflow-hidden">
                <div
                  className="w-4 h-4 text-yellow-500"
                  style={{
                    clipPath: `inset(0 ${(1 - percentage) * 100}% 0 0)`,
                  }}
                >
                  <StarIcon />
                </div>
              </div>
              <StarIcon />
            </div>
          );
        } else {
          // empty star
          return (
            <div key={i} className="w-4 h-4 text-gray-300">
              <StarIcon />
            </div>
          );
        }
      })}
    </div>
  );
}

export default Rating;
