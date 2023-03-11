import BaseLayout from "@/components/BaseLayout";
import Rating from "@/components/Rating";
import { Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../prisma/prisma";
import { authOptions } from "./api/auth/[...nextauth]";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

enum Level {
  Newbie = "Newbie",
  Minion = "Minion",
  Senior = "Senior",
  Master = "Master",
}

function Page(props: Props) {
  const { session, reviews } = props!;
  const user = session?.user!;

  let level: Level;
  if (!reviews || reviews.length < 5) level = Level.Newbie;
  else if (reviews.length < 10) level = Level.Minion;
  else if (reviews.length < 15) level = Level.Senior;
  else level = Level.Master;

  let newLevel: number;
  if (level === Level.Newbie) newLevel = 5;
  else if (level === Level.Minion) newLevel = 10;
  else if (level === Level.Senior) newLevel = 15;
  else newLevel = 20;

  const progress = (reviews!.length / newLevel) * 100;

  return (
    <BaseLayout session={session}>
      <div className="bg-surface mx-20 mt-20 flex py-6">
        <div className="m-6 flex-col flex gap-2">
          <Image
            src={user.image as string}
            className="rounded-lg border-2 border-black"
            alt="Profile Picture"
            width={128}
            height={128}
          />
          <h1 className="text-3xl font-bold pb-2">{user.name}</h1>

          <div className="flex">
            <h2 className="text-md font-bold">Email:</h2>
            <p className="text-md ml-2">{user.email}</p>
          </div>

          <div className="flex">
            <h2 className="text-md font-bold">College:</h2>
            <Link href="/college/19">
              <p className="text-md ml-2 hover:underline">
                Universidade de Lisboa - Instituto Superior Técnico
              </p>
            </Link>
          </div>

          <div className="flex mb-4">
            <h2 className="text-md font-bold">Major:</h2>
            <Link href="/major/29">
              <p className="text-md ml-2 hover:underline">
                Engenharia Informática e de Computadores
              </p>
            </Link>
          </div>

          <div className="flex justify-between">
            <div className="flex">
              <h2 className="text-md font-bold">Current level:</h2>
              <p className="text-md ml-2">{level}</p>
            </div>
            <p>
              {reviews?.length}/{newLevel}
            </p>
          </div>
          <div className="relative mb-4">
            <div className="absolute w-full h-2 bg-gray-300" />
            <div
              className="absolute h-2 bg-accent1"
              style={{ width: progress.toString() + "%" }}
            />
          </div>

          <Link href="/api/auth/signout">
            <button className="bg-black text-beige w-full px-4 py-2 rounded border-2 border-black hover:bg-surface hover:text-black">
              Logout
            </button>
          </Link>
        </div>
        <div className="m-6">
          <h1 className="text-2xl font-bold pb-2">Latest reviews</h1>
          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}

export default Page;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const reviews = await prisma?.review.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      college: true,
    },
  });

  return {
    props: {
      session,
      reviews,
    },
  };
}

function ReviewCard({ review }: any) {
  return (
    <>
      <Link href={`/college/${review.collegeId}`}>
        <p className="pt-5 border-b-2 hover:text-accent1 transition-all">
          In {review.college.name}
        </p>
      </Link>
      <div className="pl-4 pb-5 border-l-2 pt-2">
        <div className="flex items-center gap-2 mb-4">
          <Rating rating={review.overallQuality} />
          <p className="opacity-75">{review.createdAt.toLocaleDateString()}</p>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {review?.description}
        </h3>
      </div>
    </>
  );
}
