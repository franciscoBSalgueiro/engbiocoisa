import { getAverageMajorReviewRatings } from "@/utils/utils";
import { College, Major, MajorReview } from "@prisma/client";
import Link from "next/link";
import { BuildingCommunity, Users } from "tabler-icons-react";
import StarIcon from "./StarIcon";

function MajorCard({
    major,
  }: {
    major: Major & { college: College; majorReview: MajorReview[] };
  }) {
    const averageRatings = getAverageMajorReviewRatings(major.majorReview);
  
    return (
      <Link href={`/major/${major.id}`}>
        <div className="bg-surface rounded-lg px-6 py-6 hover:scale-105 transition-all ease-in-out cursor-pointer">
          <div className="flex justify-between w-full gap-10">
            <div className="mb-2 text-md font-bold line-clamp-2 h-12">
              {major.name}
            </div>
            <div className="flex flex-shrink-0 text-sm font-bold">
              {averageRatings.overallQuality ? (
                <div className="text-yellow-500 h-5 mr-1">
                  <StarIcon />
                </div>
              ) : (
                <></>
              )}
              {averageRatings.overallQuality ? (
                <>
                  {averageRatings.overallQuality.toFixed(1)}
                  <span className="ml-1 text-gray-500">
                    ({major.majorReview.length})
                  </span>
                </>
              ) : (
                "No reviews yet"
              )}
            </div>
          </div>
          <p className="flex text-sm items-center">
            <BuildingCommunity height={18} />
            {major.college.name}
          </p>
          <p className="flex text-sm items-center">
            <Users height={18} />
            {major.seats}
          </p>
        </div>
      </Link>
    );
  }

  
  export default MajorCard;