import BaseLayout from "@/components/BaseLayout";
import Rating from "@/components/Rating";
import RatingHistogram from "@/components/RatingHistogram";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Prisma, Review, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Books, Pencil } from "tabler-icons-react";
import { prisma } from "../../../prisma/prisma";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function getAverageRatings(reviews: Review[]) {
  const averages = {
    education: 0,
    extraActivities: 0,
    infrastructure: 0,
    location: 0,
    overallQuality: 0,
  };

  reviews.forEach((review) => {
    averages.education += review.education;
    averages.extraActivities += review.extraActivities;
    averages.infrastructure += review.infrastructure;
    averages.location += review.location;
    averages.overallQuality += review.overallQuality;
  });

  const aggregateRatings = {
    education: averages.education / reviews.length,
    extraActivities: averages.extraActivities / reviews.length,
    infrastructure: averages.infrastructure / reviews.length,
    location: averages.location / reviews.length,
    overallQuality: averages.overallQuality / reviews.length,
  };
  return aggregateRatings;
}

function Page(props: Props) {
  const { college } = props!;
  const [open, setOpen] = useState(false);

  if (!college) return <div>College not found</div>;
  return (
    <BaseLayout session={props!.session}>
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold pt-20">{college.name}</h1>
        <h2 className="text-2xl pb-10">{college.city}</h2>

        <div className="bg-surface rounded px-10 py-8">
          <div className="flex justify-between">
            <h2 className="text-5xl font-bold mb-4">Reviews</h2>

            <Link
              href={`/college/${college.id}/review`}
              className="bg-accent2 px-4 py-2 my-auto text-white font-bold rounded border-2 border-accent2 hover:bg-white hover:text-accent2"
            >
              Add Review
            </Link>
          </div>

          <ReviewStats
            showTotal
            reviews={college.reviews}
            field="overallQuality"
            label="Overall Quality"
          />
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
            </>
          ) : (
            <div className="w-1/3 mt-2 ml-24 text-right">
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
                <ReviewCard review={review} user={review.user} />
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
      majors: true,
      reviews: {
        include: {
          user: true,
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

function ReviewCard({ review, user }: { review: Review; user: User }) {
  return (
    <div className="px-4 py-5 flex gap-10">
      <div className="flex gap-2 mb-4 flex-shrink-0">
        {user.image && (
          <Image
            className="rounded"
            src={user.image}
            width={60}
            height={60}
            alt={""}
          />
        )}
        <div className="flex flex-col">
          <p className="font-bold text-xl">{user.name}</p>
          <div className="flex items-center gap-1">
            <Books size={20} />
            <p className="text-sm">Studying at IST</p>
          </div>
          <div className="flex items-center flex-nowrap gap-1">
            <Pencil size={20} />
            <p className="text-sm">Reviewed 10 classes</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Rating rating={review.overallQuality} />
          <p className="opacity-75">{review.createdAt.toLocaleDateString()}</p>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {review?.description}
        </h3>
      </div>
    </div>
  );
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
  const averageRatings = getAverageRatings(reviews || {});
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
