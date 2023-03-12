import BaseLayout from "@/components/BaseLayout";
import Rating from "@/components/Rating";
import RatingHistogram from "@/components/RatingHistogram";
import ReviewCard from "@/components/ReviewCard";
import StarIcon from "@/components/StarIcon";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/prisma/prisma";
import {
  getAverageMajorReviewRatings,
  getAverageReviewRatings
} from "@/utils/utils";
import { Major, MajorReview, Prisma, Review } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, MapPin } from "tabler-icons-react";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function Page(props: Props) {
  const { college } = props!;
  const [open, setOpen] = useState(false);

  if (!college) return <div>College not found</div>;
  return (
    <BaseLayout session={props!.session}>
      <div className="px-52 py-10">
        <div className="bg-surface rounded px-10 py-8 max-w-6xl mx-auto mb-10">
          <Link
            href="/browse"
            className="flex text-gray-500 text-sm items-center gap-2 hover:underline"
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 className="text-3xl font-bold pt-20">{college.name}</h1>
          <h2 className="text-2xl pb-10 flex gap-2 items-center">
            <MapPin />
            {college.city}
          </h2>

          <h2 className="text-2xl font-bold mb-4">Majors</h2>
          <div className="flex overflow-auto flex-nowrap gap-10 pb-2">
            {college.majors.map((major) => (
              <MajorPreview key={major.id} major={major} />
            ))}
          </div>
        </div>

        <div className="bg-surface rounded px-10 py-8 max-w-6xl mx-auto">
          <div className="flex justify-between">
            <h2 className="text-5xl font-bold mb-4">Reviews</h2>

            {props!.session && (
              <Link
                href={`/college/${college.id}/review`}
                className="bg-accent2 px-4 py-2 my-auto text-white font-bold rounded border-2 border-accent2 hover:bg-white hover:text-accent2"
              >
                Add Review
              </Link>
            )}
          </div>
          <div className="sticky top-0 bg-surface z-10 p-4 border-b-2 pt-10">
            <ReviewStats
              showTotal
              reviews={college.reviews}
              field="overallQuality"
              label="Overall Quality"
            />
          </div>

          {open ? (
            <>
              <ReviewStats
                reviews={college.reviews}
                field="education"
                label="Education"
              />
              <ReviewStats
                reviews={college.reviews}
                field="extraActivities"
                label="Extra Activities"
              />
              <ReviewStats
                reviews={college.reviews}
                field="infrastructure"
                label="Infrastructure"
              />
              <ReviewStats
                reviews={college.reviews}
                field="location"
                label="Location"
              />
              <div className="w-full mt-2 text-center py-4 border-b-2">
                <button
                  className="hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Show Less
                </button>
              </div>
            </>
          ) : (
            <div className="w-full mt-2 text-center py-4 border-b-2">
              {props?.session ? (
                <button
                  className="hover:underline"
                  onClick={() => setOpen(true)}
                >
                  Show More
                </button>
              ) : (
                <Link className="hover:underline" href="/signin">
                  Login to see more
                </Link>
              )}
            </div>
          )}

          <div className="flex flex-col divide-y divide-gray-300">
            {college?.reviews?.map((review) => (
              <div key={review.id} className="py-4">
                <ReviewCard
                  review={review}
                  user={review.user}
                  session={props?.session}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Page;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const collegeId = context.params?.id;
  if (collegeId === undefined) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  const college = await prisma?.college.findUnique({
    where: {
      id: parseInt(collegeId as string),
    },
    include: {
      majors: {
        include: {
          majorReview: true,
        },
      },
      reviews: {
        include: {
          user: {
            include: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  return {
    props: {
      session,
      college,
    },
  };
}

function ReviewStats({
  showTotal,
  reviews,
  field,
  label,
}: {
  showTotal?: boolean;
  reviews: Review[];
  field: string;
  label: string;
}) {
  const averageRatings = getAverageReviewRatings(reviews || {});
  const rField = field as keyof typeof averageRatings;

  return (
    <div className="flex divide-x divide-gray-300 mt-10">
      <div className="px-20" style={{ opacity: showTotal ? 1 : 0 }}>
        <p className="font-bold text-lg mb-2">Total Reviews</p>
        <div className="flex gap-2 items-center">
          <p className="text-3xl font-bold">{reviews?.length}</p>
          <div className="flex items-center px-2 bg-accent1 opacity-70 text-sm rounded-lg">
            100%
            <ArrowUpRight height={15} width={15} />
          </div>
        </div>
        <p className="opacity-50">{"Growth in reviews last year"}</p>
      </div>
      <div className="px-20">
        <p className="font-bold text-lg mb-2">{label}</p>
        <div className="flex gap-2 items-center">
          <p className="text-3xl font-bold">
            {averageRatings[rField].toFixed(1)}
          </p>
          <Rating rating={averageRatings[rField]} />
        </div>
        <p className="opacity-50">{"Based on last year's reviews"}</p>
      </div>
      <div className="px-20">
        <RatingHistogram reviews={reviews} field={rField} />
      </div>
    </div>
  );
}

function MajorPreview({
  major,
}: {
  major: Major & { majorReview: MajorReview[] };
}) {
  const averageRatings = getAverageMajorReviewRatings(major.majorReview);
  return (
    <Link
      href={`/major/${major.id}`}
      key={major.id}
      className="rounded-lg px-4 py-4 border-accent1 border-2 hover:bg-accent1 hover:text-white"
    >
      <h2 className="font-bold text-md flex flex-col justify-between h-20 w-32 line-clamp-3">
        {major.name}
      </h2>

      <div className="flex">
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
    </Link>
  );
}
