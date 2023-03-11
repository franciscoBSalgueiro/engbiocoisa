import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// read data from csv file
const collegeCSV = fs.readFileSync("prisma/data/college_data.csv", "utf8");
const collegeData = collegeCSV.split("\n");
const collegeDataArray: Prisma.CollegeCreateInput[] = collegeData.map(
  (college) => {
    const collegeArray = college.split(",");
    return {
      dgesID: collegeArray[0],
      name: collegeArray[1],
      city: collegeArray[2],
      totalStudents: 0,
    };
  }
);

// read data from csv file
const majorCSV = fs.readFileSync("prisma/data/majors_data.csv", "utf8");
const majorData = majorCSV.split("\n");
const majorDataArray: Prisma.MajorCreateInput[] = majorData.map((major) => {
  const majorArray = major.split(",");
  return {
    name: majorArray[2],
    dgesID: majorArray[1],
    college: {
      connect: {
        dgesID: majorArray[0],
      },
    },
    cycle: majorArray[3],
    seats: parseInt(majorArray[4]),
  };
});

async function main() {
  console.log(`Start seeding ...`);
  for (const c of collegeDataArray) {
    const college = await prisma.college.upsert({
      where: { dgesID: c.dgesID },
      update: {},
      create: c,
    });
    console.log(`Created college with id: ${college.id}`);
  }
  for (const m of majorDataArray) {
    const major = await prisma.major.upsert({
      where: { dgesID: m.dgesID },
      update: {},
      create: m,
    });
    console.log(`Created major with id: ${major.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
