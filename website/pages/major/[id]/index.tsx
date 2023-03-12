import BaseLayout from "@/components/BaseLayout";
import Rating from "@/components/Rating";
import RatingHistogram from "@/components/RatingHistogram";
import ReviewCard from "@/components/ReviewCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAverageMajorReviewRatings } from "@/utils/utils";
import { MajorReview, Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, BuildingCommunity } from "tabler-icons-react";
import { prisma } from "../../../prisma/prisma";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function Page(props: Props) {
  const { major } = props!;
  const [open, setOpen] = useState(false);

  if (!major) return <div>Major not found...</div>;
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
          <h1 className="text-3xl font-bold pt-20">{major.name}</h1>
          <Link href={`/college/${major.college.id}`}>
            <h2 className="text-2xl pb-10 flex gap-2 items-center hover:underline">
              <BuildingCommunity />
              {major.college.name}
            </h2>
          </Link>
        </div>

        <div className="bg-surface rounded px-10 py-8 max-w-6xl mx-auto">
          <div className="flex justify-between">
            <h2 className="text-5xl font-bold mb-4">Reviews</h2>

            {props?.session && (
              <Link
                href={`/major/${major.id}/review`}
                className="bg-accent2 px-4 py-2 my-auto text-white font-bold rounded border-2 border-accent2 hover:bg-white hover:text-accent2"
              >
                Add Review
              </Link>
            )}
          </div>

          <div className="sticky top-0 bg-surface z-10 p-4 border-b-2 pt-10">
            <ReviewStats
              showTotal
              reviews={major.majorReview}
              field="overallQuality"
              label="Overall Quality"
            />
          </div>
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
            {major?.majorReview?.map((majorReview) => (
              <div key={majorReview.id} className="py-4">
                <ReviewCard
                  review={majorReview}
                  user={majorReview.user}
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
      major,
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
  reviews: MajorReview[];
  field: string;
  label: string;
}) {
  const averageRatings = getAverageMajorReviewRatings(reviews);
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
