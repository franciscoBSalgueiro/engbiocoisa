import StarIcon from "./StarIcon";

function RatingHistogram<T>({
  reviews,
  field,
}: {
  reviews: T[];
  field: keyof T;
}) {
  return (
    <div className="flex flex-col">
      {[...Array(5)].map((_, i) => {
        const value = i + 1;
        const count = reviews.filter(
          (review) => review[field] === value
        ).length;

        const percentage = (count / reviews.length) * 100;

        return (
          <div key={value} className="flex gap-2">
            <div className="flex h-4 gap-1 items-center">
              <StarIcon /> <p>{value}</p>
            </div>
            <div className="flex gap-2 items-center w-60">
              <div
                className="bg-accent2 h-2 rounded"
                style={{ width: `${percentage}%` }}
              />
              <p className="font-bold">{count}</p>
            </div>
          </div>
        );
      }).reverse()}
    </div>
  );
}

export default RatingHistogram;
