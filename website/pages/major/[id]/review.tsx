import BaseLayout from "@/components/BaseLayout";
import StarRating from "@/components/StarRatingInput";
import { Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useState } from "react";

import { prisma } from "../../../prisma/prisma";

import { authOptions } from "../../api/auth/[...nextauth]";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function TextInput({
  required,
  setValue,
}: {
  required?: boolean;
  setValue: (value: string) => void;
}) {
  return (
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 pb-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      onChange={(e) => setValue(e.target.value)}
      type="text"
      required={required}
    />
  );
}

function Page(props: Props) {
  const { major } = props!;

  const [overallQuality, setOverallQuality] = useState(0);
  const [education, setEducation] = useState(0);
  const [lifeBalance, setLifeBalance] = useState(0);
  const [cons, setCons] = useState("");
  const [pros, setPros] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const review = await fetch(`/api/major/${major!.id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        overallQuality,
        education,
        lifeBalance,
        cons,
        pros,
        description,
      }),
    });
    router.push(`/major/${major!.id}`);
  }

  return (
    <BaseLayout session={props!.session}>
      <form
        className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 bg-surface px-6 py-4 rounded">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 max-w-xl">
            Review
          </h1>
          <div className="flex flex-col gap-2">
            <StarRating
              label="Overall Quality"
              rating={overallQuality}
              setRating={setOverallQuality}
            />
            <StarRating
              label="Life Balance"
              rating={lifeBalance}
              setRating={setLifeBalance}
            />

            <StarRating
              label="Education"
              rating={education}
              setRating={setEducation}
            />
            <p>Pros</p>
            <TextInput setValue={setPros} />
            <p>Cons</p>
            <TextInput setValue={setCons} />

            <p className="text-gray-700 text-md">
              Comments:
              <span className="text-red-500">*</span>
            </p>

            <TextInput required setValue={setDescription} />

            <button
              type="submit"
              className="bg-accent1 hover:bg-surface border-accent1 border-2 text-white hover:text-accent1 font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
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
  });

  return {
    props: {
      session,
      major,
    },
  };
}
