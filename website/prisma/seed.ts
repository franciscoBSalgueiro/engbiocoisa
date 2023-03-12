import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

const COLLEGE_CSV_FILE = "prisma/data/colleges.csv";
const MAJOR_CSV_FILE = "prisma/data/majors.csv";

const reviews: {
  description: string;
  overallQuality: number;
  location: number;
  infrastructure: number;
  education: number;
  extraActivities: number;
  cons: string;
  pros: string;
}[] = [
  {
    description:
      "From my experience it's hard but very interesting. I'm learning a lot of things and I'm very happy with my choice.",
    overallQuality: 4,
    location: 4,
    infrastructure: 5,
    education: 4,
    extraActivities: 3,
    cons: "The food is not that good.",
    pros: "The teachers are very good.",
  },
  {
    description:
      "I wouldn't recommend this college to anyone. The teachers are not good and the location is not good either.",
    overallQuality: 2,
    location: 1,
    infrastructure: 5,
    education: 2,
    extraActivities: 4,
    cons: "The teachers don't really care about you and the teaching method is very old. The location is awful too.",
    pros: "It's a new university, the classrooms are new and comfy.",
  },
  {
    description:
      "If I could go back I would probably not choose this college, it's not worth it to be so far away from home. Other than that it's alright.",
    overallQuality: 4,
    location: 1,
    infrastructure: 5,
    education: 4,
    extraActivities: 4,
    cons: "It's in the middle of nowhere, it's very far away from home. I take about 2 hours to get there.",
    pros: "I like the students, they are very friendly and the teachers are good.",
  },
  {
    description:
      "I'm glad I chose it. I made some awesome friends and I'm learning a lot of things. I feel like I'm actually being prepared for the future.",
    overallQuality: 5,
    location: 4,
    infrastructure: 5,
    education: 4,
    extraActivities: 4,
    cons: "Maybe a bit hard to get used to the new teaching method.",
    pros: "I love the environment, it's very friendly and the teachers are very good.",
  },
  {
    description:
      "I love it, but the living costs are a bit high. I don't think if I went to another one I would have the same experience.",
    overallQuality: 5,
    location: 3,
    infrastructure: 4,
    education: 2,
    extraActivities: 2,
    cons: "The living costs are a bit high and there are no student housing nearby.",
    pros: "I love the campus and the buildings are very nice",
  },
];

// read data from csv file
const collegeCSV = fs.readFileSync(COLLEGE_CSV_FILE, "utf8");
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
const majorCSV = fs.readFileSync(MAJOR_CSV_FILE, "utf8");
const majorData = majorCSV.split("\n");
const majorDataArray: Prisma.MajorCreateInput[] = majorData.map((major) => {
  const majorArray = major.split(",");
  return {
    college: {
      connect: {
        dgesID: majorArray[0],
      },
    },
    collegeDGES: majorArray[0],
    dgesID: majorArray[1],
    name: majorArray[2],
    cycle: majorArray[3],
    seats: parseInt(majorArray[4]),
  };
});

const userDataArray: Prisma.UserCreateInput[] = [
  {
    email: "rogerio@gmail.com",
    name: "Rogério",
    image:
      "https://cdn.discordapp.com/attachments/917821109213233243/1084449234016817262/rogerio_colaco.png",
  },

  {
    email: "imaybelostnow@gmail.com",
    name: "randomPerson",
    image:
      "https://cdn.discordapp.com/attachments/916301068898545685/1080253392133296208/Screenshot_20230228-222043_Instagram.jpg",
  },

  {
    email: "incellonlife@gmail.com",
    name: "tsundere445",
    image:
      "https://cdn.discordapp.com/attachments/954410926398914601/1078354521459273778/image.png",
  },

  {
    email: "llookk75@gmail.com",
    name: "llookk75",
    image:
      "https://cdn.discordapp.com/attachments/358652454738329601/1074826470272286751/Ej9hJEAWkAAiTXv.png",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userDataArray) {
    const user = await prisma.user.upsert({
      where: { email: u.email as string },
      update: {},
      create: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const c of collegeDataArray) {
    const college = await prisma.college.upsert({
      where: { dgesID: c.dgesID },
      update: {},
      create: c,
    });

    const nReviews = Math.floor(Math.random() * 5);
    for (let i = 0; i < nReviews; i++) {
      const newReview = reviews[Math.floor(Math.random() * reviews.length)];
      const reviewUser =
        userDataArray[Math.floor(Math.random() * userDataArray.length)];

      const review = await prisma.review.create({
        data: {
          ...newReview,
          college: {
            connect: {
              dgesID: college.dgesID,
            },
          },
          user: {
            connect: {
              email: reviewUser.email as string,
            },
          },
        },
      });
      console.log(`Created review with id: ${review.id}`);
    }

    console.log(`Created college with id: ${college.id}`);
  }
  for (const m of majorDataArray) {
    const major = await prisma.major.upsert({
      where: {
        dgesID_collegeDGES: {
          collegeDGES: m.collegeDGES,
          dgesID: m.dgesID,
        },
      },
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
