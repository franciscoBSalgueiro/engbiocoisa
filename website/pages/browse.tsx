import BaseLayout from "@/components/BaseLayout";
import Dropdown from "@/components/Dropdown";
import MajorCard from "@/components/MajorCard";
import StarIcon from "@/components/StarIcon";
import { getAverageReviewRatings } from "@/utils/utils";
import { College, Major, MajorReview, Prisma, Review } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Books,
  MapPin,
  Search,
  SortAscending,
  SortDescending
} from "tabler-icons-react";
import { prisma } from "../prisma/prisma";
import { authOptions } from "./api/auth/[...nextauth]";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function Page(props: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("college");
  const [colleges, setColleges] = useState(props.colleges);
  const [majors, setMajors] = useState<
    (Major & { college: College; majorReview: MajorReview[] })[]
  >([]);
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetch(
      `/api/search?q=${searchTerm}&type=${type}&sort=${sort}&order=${order}`
    ).then((res) =>
      res.json().then((data) => {
        if (type === "major") setMajors(data);
        else setColleges(data);
      })
    );
  }, [searchTerm, type, sort, order]);

  return (
    <BaseLayout session={props.session}>
      <div className="px-40 py-10">
        <div className="sticky top-0 border-b-2 border-black py-4 bg-beige z-10">
          <h1 className="text-5xl font-bold mb-4">Search</h1>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-surface text-lg rounded-lg px-4 py-3 w-full pl-12 outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute top-0 left-0 h-full flex items-center px-3">
              <Search />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="border mt-4 grid grid-cols-2 gap-4 text-center max-w-md w-full">
              <button
                onClick={() => setType("college")}
                className={`px-2 py-2 rounded-lg font-bold border-2 border-transparent ${
                  type === "college"
                    ? "bg-accent2 text-white"
                    : "bg-surface hover:border-accent2"
                }`}
              >
                College
              </button>

              <button
                onClick={() => setType("major")}
                className={`px-2 py-2 rounded-lg font-bold border-2 border-transparent ${
                  type === "major"
                    ? "bg-accent2 text-white"
                    : "bg-surface hover:border-accent2"
                }`}
              >
                Major
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <p>Sort by</p>
              <Dropdown
                options={["name", "reviews"]}
                onChange={setSort}
                defaultOption={sort}
              />
              <button
                className="bg-surface h-full p-1 border border-surface"
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              >
                {order === "asc" ? <SortAscending /> : <SortDescending />}
              </button>
            </div>
          </div>
        </div>

        {type === "major" ? (
          <>
            <p className="mt-6 text-lg">{majors.length} results</p>

            <div className="py-4 grid grid-cols-3 gap-4">
              {majors?.map((major) => (
                <MajorCard key={major.id} major={major} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 text-lg">{colleges.length} results</p>
            <div className="py-4 grid grid-cols-3 gap-4">
              {colleges?.map((uni) => (
                <CollegeCard key={uni.id} college={uni} />
              ))}
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const colleges = await prisma?.college.findMany({
    include: {
      reviews: true,
      majors: true,
    },
  });

  return {
    props: {
      session,
      colleges,
    },
  };
}

export default Page;

function CollegeCard({
  college,
}: {
  college: College & {
    reviews: Review[];
    majors: Major[];
  };
}) {
  const averageRatings = getAverageReviewRatings(college.reviews);
  return (
    <Link href={`/college/${college.id}`}>
      <div className="bg-surface rounded-lg px-6 py-6 hover:scale-105 transition-all ease-in-out cursor-pointer group">
        <div className="flex justify-between w-full gap-10">
          <div className="mb-2 text-md font-bold line-clamp-2 group-hover:line-clamp-none h-12 group-hover:h-auto">
            {college.name}
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
                  ({college.reviews.length})
                </span>
              </>
            ) : (
              "No reviews yet"
            )}
          </div>
        </div>
        <p className="flex text-sm items-center">
          <MapPin height={18} />
          {college.city}
        </p>
        <p className="flex text-sm items-center">
          <Books height={18} />
          Majors: {college.majors.length}
        </p>
      </div>
    </Link>
  );
}
