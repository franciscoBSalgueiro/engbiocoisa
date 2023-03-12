import { MajorReview, Review, User } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { Books, Pencil, Trash } from "tabler-icons-react";
import Rating from "./Rating";

function ReviewCard({
  review,
  user,
  session,
}: {
  review: Review | MajorReview;
  user: User & { reviews: Review[] };
  session: Session | null | undefined;
}) {
  async function deleteReview() {
    let res;
    if ("lifeBalance" in review) {
      res = await fetch(`/api/major//${review.id}/delete`, {
        method: "DELETE",
      });
    } else {
      res = await fetch(`/api/college/${review.id}/delete`, {
        method: "DELETE",
      });
    }

    if (res.status === 200) {
      window.location.reload();
    }
  }

  return (
    <div className="px-4 py-5 flex gap-10 justify-between">
      <div className="flex gap-2 mb-4 w-72">
        {user.image && (
          <div className="aspect-square w-20 h-20 relative">
            <Image className="rounded" src={user.image} fill alt={""} />
          </div>
        )}
        <div className="flex flex-col">
          <p className="font-bold text-xl">{user.name}</p>
          <div className="flex items-center gap-1">
            <Books size={20} />
            <p className="text-sm">Studying at IST</p>
          </div>
          <div className="flex items-center flex-nowrap gap-1">
            <Pencil size={20} />
            <p className="text-sm">Reviewed {user.reviews.length} classes</p>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <Rating rating={review.overallQuality} />
          <p className="opacity-75">{review.createdAt.toLocaleDateString()}</p>
        </div>
        <div className="text-lg leading-6 font-medium text-gray-900">
          <p className="mb-4">{review.description}</p>
          <p>Pros: {review.pros}</p>
          <p>Cons: {review.cons}</p>
        </div>
      </div>
      {session && user.email === session.user.email && (
        <button
          className="text-gray-500 hover:text-red-500 float-right h-10"
          onClick={deleteReview}
        >
          <Trash />
        </button>
      )}
    </div>
  );
}

export default ReviewCard;
