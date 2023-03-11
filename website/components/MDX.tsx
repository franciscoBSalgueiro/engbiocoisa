import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";

const components = {
  Head,
};

export default function MdxPage({ children, source, frontMatter }: any) {
  return (
    <article className="prose mx-auto p-6 max-w-5xl">
      <header>
        <div className="mb-6">
          <h1 className="text-4xl font-bold mt-4">
            {frontMatter.title}
          </h1>

          <p className="opacity-60 mb-4 mt-2">
            Published on{" "}
            <time dateTime={frontMatter.publishedAt}>
              {frontMatter.publishedAt.toLocaleDateString()}
            </time>
          </p>
          <img src={frontMatter.cover} alt={frontMatter.title} />

          {frontMatter.author && (
            <div className="-mt-6">
              <p className="opacity-60 pl-1">{frontMatter.author}</p>
            </div>
          )}
          {frontMatter.description && (
            <p className="description">{frontMatter.description}</p>
          )}
        </div>
      </header>
      <section className="max-w-2xl mx-auto text-justify">
        <MDXRemote {...source} components={components} />
      </section>
    </article>
  );
}
