import BaseLayout from "@/components/BaseLayout";
import BlogPreview from "@/components/BlogPreview";
import { Prisma } from "@prisma/client";
import fs from "fs";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import "tailwindcss/tailwind.css";
import parse from "../lib/mdx";
import { authOptions } from "./api/auth/[...nextauth]";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function App(props: Props) {
  return (
    <BaseLayout session={props.session}>
      <div className="flex justify-between mb-32">
        <div>
          <h1 className="text-8xl font-bold ml-20 mt-40">
            Master your <br />
            Momentum.
          </h1>
          <div className="w-12 h-2 border bg-black absolute left-80 animate-slideIn" />
          <Link href="/signin">
            <button className="bg-accent1 border-2 border-accent1 hover:bg-beige hover:text-accent1 font-bold text-white px-8 py-4 rounded-lg mt-8 ml-20">
              Get Started
            </button>
          </Link>
        </div>
        <div className="mr-60 relative">
          <Image src="/hero.png" height={650} width={650} alt={""} />
          <div className="h-28 w-28 bg-accent1 absolute top-0 right-0 translate-y-1/2 translate-x-1/2 -rotate-6" />
          <div className="h-32 w-32 bg-accent1 absolute bottom-0 right-32 translate-y-1/2 translate-x-1/2 -rotate-6" />
          <div className="h-40 w-40 bg-accent1 absolute bottom-0 translate-y-1/2 -translate-x-1/2 rotate-6" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/browse"
            className="bg-surface py-8 rounded-lg border-2 border-black hover:text-accent1"
          >
            <h2 className="text-2xl font-bold mb-4 px-8">Find University</h2>
            <p className="text-gray-600 px-8">
              See or Create reviews of a university.
            </p>
          </Link>
          <Link
            href="/browse"
            className="bg-surface py-8 rounded-lg border-2 border-black hover:text-accent1"
          >
            <h2 className="text-2xl font-bold mb-4 px-8">Find Major</h2>
            <p className="text-gray-600 px-8">
              See or Create reviews of a Major.
            </p>
          </Link>
        </div>
        <Link href="/blog">
          <h2 className="text-4xl font-bold py-10">News</h2>
        </Link>
        <div className="grid grid-cols-3 gap-4">
          {props.posts.map((post) => (
            <BlogPreview
              key={post.slug}
              image={post.image}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}

export default App;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // get all the posts in /content

  const postsDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDirectory);

  const sources = filenames.map((filename) =>
    fs.readFileSync(path.join(postsDirectory, filename), "utf8")
  );

  const posts = [];
  for (const source of sources) {
    const { frontMatter } = await parse(source);
    posts.push({
      title: frontMatter.title,
      image: frontMatter.cover,
      date: frontMatter.publishedAt.toLocaleDateString(),
      excerpt: frontMatter.excerpt,
      slug: filenames[posts.length].replace(".md", ""),
    });
  }

  return {
    props: {
      session,
      posts,
    },
  };
}
