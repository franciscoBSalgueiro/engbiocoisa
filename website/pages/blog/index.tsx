import BaseLayout from "@/components/BaseLayout";
import BlogPreview from "@/components/BlogPreview";
import { Prisma } from "@prisma/client";
import fs from "fs";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import path from "path";
import parse from "../../lib/mdx";
import { authOptions } from "../api/auth/[...nextauth]";

type Props = Prisma.PromiseReturnType<typeof getServerSideProps>["props"];

function Page(props: Props) {
  return (
    <BaseLayout session={props.session}>
      <div className="mx-20">
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

export default Page;

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
