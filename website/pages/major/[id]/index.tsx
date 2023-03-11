import BaseLayout from "@/components/BaseLayout";
import Rating from "@/components/Rating";
import RatingHistogram from "@/components/RatingHistogram";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { MajorReview, Prisma, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Books, Pencil } from "tabler-icons-react";
import { prisma } from "../../../prisma/prisma";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function getAverageRatings(reviews: MajorReview[]) {
  const averages = {
    overallQuality: 0,
    education: 0,
    lifeBalance: 0,
  };

  reviews.forEach((review) => {
    averages.education += review.education;
    averages.overallQuality += review.overallQuality;
    averages.lifeBalance += review.lifeBalance;
  });

  const aggregateRatings = {
    education: averages.education / reviews.length,
    overallQuality: averages.overallQuality / reviews.length,
    lifeBalance: averages.lifeBalance / reviews.length,
  };
  return aggregateRatings;
}

function Page(props: Props) {
  const { major } = props!;
  const [open, setOpen] = useState(false);

  if (!major) return <div>Major not found...</div>;
  return (
    <BaseLayout session={props!.session}>
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold pt-20">{major.name}</h1>
        <h2 className="text-2xl pb-10">{major.college.name}</h2>

        <div className="bg-surface rounded px-10 py-8">
          <div className="flex justify-between">
            <h2 className="text-5xl font-bold mb-4">Reviews</h2>

            <Link
              href={`/major/${major.id}/review`}
              className="bg-accent2 px-4 py-2 my-auto text-white font-bold rounded border-2 border-accent2 hover:bg-white hover:text-accent2"
            >
              Add Review
            </Link>
          </div>

          <ReviewStats
            showTotal
            reviews={major.majorReview}
            field="overallQuality"
            label="Overall Quality"
          />
          {open ? (
            <>
              <ReviewStats
                reviews={major.majorReview}
                field="education"
                label="Education"
              />
              <ReviewStats
                reviews={major.majorReview}
                field="lifeBalance"
                label="Life Balance"
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
            {major?.majorReview?.map((majorReview) => (
              <div key={majorReview.id} className="py-4">
                <ReviewCard review={majorReview} user={majorReview.user} />
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

  const majorId = context.params?.id;
  if (majorId === undefined) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  const major = await prisma?.major.findUnique({
    where: {
      id: parseInt(majorId as string),
    },
    include: {
      college: true,
      majorReview: {
        include: {
          user: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      major,
    },
  };
}

function ReviewCard({ review, user }: { review: MajorReview; user: User }) {
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
          </div>{" "}
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
  reviews: MajorReview[];
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
          <Rating rating={averageRatings.overallQuality} />
        </div>
        <p className="opacity-50">{"Based on last year's reviews"}</p>
      </div>
      <div className="px-20">
        <RatingHistogram reviews={reviews} field={rField} />
      </div>
    </div>
  );
}
