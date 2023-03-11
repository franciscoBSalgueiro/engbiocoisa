import BaseLayout from "@/components/BaseLayout";
import fs from "fs";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import path from "path";

import MdxPage from "../../components/MDX";
import parse from "../../lib/mdx";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Page({ session, source, frontMatter }: any) {
  return (
    <BaseLayout session={session}>
      <MdxPage source={source} frontMatter={frontMatter} />;
    </BaseLayout>
  );
}

const CONTENT_PATH = path.join(process.cwd(), "content/");

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const mdxPath = path.join(
    CONTENT_PATH,
    `${(context.params!.slug! as string[]).join("/")}.mdx`
  );
  const postFilePath = fs.existsSync(mdxPath) ? mdxPath : mdxPath.slice(0, -1);
  const source = fs.readFileSync(postFilePath);

  const { mdxSource, frontMatter } = await parse(source);

  return {
    props: {
      session,
      source: mdxSource,
      frontMatter: frontMatter,
      title: frontMatter.title || "",
      cover: frontMatter.cover || "",
    },
  };
}
