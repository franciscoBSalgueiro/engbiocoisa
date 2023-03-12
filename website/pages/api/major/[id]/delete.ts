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
  const r = await prisma.majorReview.delete({
    where: {
      id: idNum,
    },
  });
  res.status(200).json(r);
}
