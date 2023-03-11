import "@/styles/globals.css";
import { MDXProvider } from "@mdx-js/react";
import type { AppProps } from "next/app";
import Head from "next/head";

const components = {
  h1: (props: any) => (
    <h1 className="text-4xl font-bold text-gray-900" {...props} />
  ),
  p: (props: any) => <p className="text-lg mb-4" {...props} />,
  a: (props: any) => (
    <a
      className="text-blue-500 hover:text-blue-600"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props: any) => <ul className="list-disc ml-5" {...props} />,
  ol: (props: any) => <ol className="list-decimal ml-5" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
      {...props}
    />
  ),
  code: (props: any) => <code className="bg-gray-100 rounded p-1" {...props} />,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MasterMomentum.</title>
      </Head>
      <MDXProvider components={components}>
        <div className="bg-beige min-h-screen">
          <Component {...pageProps} />
        </div>
      </MDXProvider>
    </>
  );
}
