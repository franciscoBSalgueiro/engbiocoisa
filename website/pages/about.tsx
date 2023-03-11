import BaseLayout from "@/components/BaseLayout";
import { GetServerSidePropsContext } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

function Page({ session }: { session: Session | null }) {
  return (
    <BaseLayout session={session}>
      <div className="mx-20 my-20">
        <h1 className="text-4xl font-bold mb-4">About us</h1>

        <p className="mb-4">
          {
            "Welcome to MasterMomentum, the ultimate website designed to help you make an informed decision about your desired bachelor's or master's degree program, your next college subjects and much more. MasterMomentum allows you with just a few taps to browse through a wide range of degree programs and find the one that best matches your interests and career aspirations. Our app provides you with detailed insights into each degree program, giving you a clear understanding of what to expect in terms of coursework, faculty, facilities, and career opportunities."
          }
        </p>
        <p className="mb-20">
          {
            "Whether you're a high school student or a working professional looking to advance your education, MasterMomentum is your go-to app for all things related to higher education. So why wait? Create your account today and take the first step towards achieving your academic and career goals."
          }
        </p>

        <p className="text-center text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to- bg-yellow-400">
          Your Momentum is our Master
        </p>
      </div>
    </BaseLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
}

export default Page;
