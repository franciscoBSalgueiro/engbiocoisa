import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q, type, sort, order } = req.query as {
    q: string;
    type: string;
    sort: string;
    order: "asc" | "desc";
  };

  // if (!q) {
  //   const colleges = await prisma.college.findMany();
  //   res.status(200).json(colleges);
  // } else {
  let sorting: any = order;
  if (sort === "reviews") {
    sorting = { _count: order };
  }
  if (type === "college") {
    const colleges = await prisma.college.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      include: {
        reviews: true,
        majors: true,
      },
      orderBy: {
        [sort]: sorting,
      },
    });

    res.status(200).json(colleges);
  } else {
    let newsort = sort;
    if (sort === "reviews") {
      newsort = "majorReview";
    }
    const courses = await prisma.major.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      include: {
        college: true,
        majorReview: true,
      },
      orderBy: {
        [newsort]: sorting,
      },
    });

    res.status(200).json(courses);
  }
}
