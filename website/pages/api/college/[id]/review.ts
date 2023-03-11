import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ message: "No id provided" });
    return;
  }
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const idNum = parseInt(id as string);
  if (isNaN(idNum)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const college = await prisma.college.findUnique({
    where: {
      id: idNum,
    },
  });
  if (college) {
    const review = req.body as {
      description: string;
      overallQuality: number;
      location: number;
      infrastructure: number;
      education: number;
      extraActivities: number;
      cons: string;
      pros: string;
      nocturnalLife: number;
    };
    await prisma.review.create({
      data: {
        collegeId: college.id,
        userId: user.id,
        description: review.description,
        overallQuality: review.overallQuality,
        location: review.location,
        infrastructure: review.infrastructure,
        education: review.education,
        extraActivities: review.extraActivities,
        cons: review.cons,
        pros: review.pros,
      },
    });
    res.status(200).json(review);
  } else {
    res.status(400).json({ message: "Failed to find nation" });
  }
}
