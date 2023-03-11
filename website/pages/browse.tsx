import BaseLayout from "@/components/BaseLayout";
import Dropdown from "@/components/Dropdown";
import { College, Major, Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, SortAscending, SortDescending } from "tabler-icons-react";
import { prisma } from "../prisma/prisma";
import { authOptions } from "./api/auth/[...nextauth]";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function Page(props: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("college");
  const [colleges, setColleges] = useState(props.colleges);
  const [majors, setMajors] = useState<Major[]>([]);
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
        <div className="sticky top-0 border-b-2 border-black py-4 bg-beige">
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
                className={`px-2 py-2 rounded-lg font-bold ${
                  type === "college" ? "bg-accent2 text-white" : "bg-surface"
                }`}
              >
                College
              </button>

              <button
                onClick={() => setType("major")}
                className={`px-2 py-2 rounded-lg font-bold ${
                  type === "major" ? "bg-accent2 text-white" : "bg-surface"
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
              <button className="bg-surface h-full p-1 border border-surface" onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
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
    take: 10,
  });

  return {
    props: {
      session,
      colleges,
    },
  };
}

export default Page;

function CollegeCard({ college }: { college: College }) {
  return (
    <div className="bg-surface rounded-lg border-2 border-black px-6 py-2">
      <div className="flex justify-between w-full py-4">
        <div>
          <div className="mb-4 text-lg font-bold ">{college.name}</div>
          <p>
            <span className="font-bold">Location:</span> {college.city}
          </p>
        </div>
      </div>

      <Link href={`/college/${college.id}`}>
        <button className="bg-accent2 text-beige font-bold hover:bg-surface hover:text-accent2 border-2 border-accent2 px-4 py-2 rounded-lg">
          View
        </button>
      </Link>
    </div>
  );
}

function MajorCard({ major }: { major: Major }) {
  return (
    <div className="bg-surface shadow-lg rounded-lg border-2 border-black px-6 py-2">
      <div className="flex justify-between w-full py-4">
        <div>
          <div className="mb-4 text-lg font-bold ">{major.name}</div>
          <p>
            {/* @ts-ignore */}
            <span className="font-bold">University:</span> {major.college.name}
          </p>
        </div>
      </div>

      <Link href={`/major/${major.id}`}>
        <button className="bg-accent2 text-beige font-bold hover:bg-surface hover:text-accent2 border-2 border-accent2 px-4 py-2 rounded-lg">
          View
        </button>
      </Link>
    </div>
  );
}
