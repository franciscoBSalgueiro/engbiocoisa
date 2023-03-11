import FormField from "@/components/FormField";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail } from "tabler-icons-react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SignIn({ providers }: any) {
  let discord = providers.discord;
  return (
    <div className="h-full min-h-screen w-full min-w-screen bg-gray relative overflow-hidden">
      <Image src="/img/ist.webp" layout="fill" objectFit="cover" alt="" />
      <div
        className="w-full h-full absolute"
        style={{
          backgroundImage:
            "linear-gradient(65deg, #282A37 50%, rgba(40, 42, 55, 0.6))",
        }}
      >
        <div className="lg:block lg:px-32 flex flex-col items-center px-5 py-56">
          <h1 className="text-white font-bold text-5xl">
            Create new Account
            <span className="text-tblue text-7xl select-none">.</span>
          </h1>
          <h2 className="text-gray-100 mt-4">
            Already have an account?{" "}
            <Link href={"/signin"}>
              <span className="text-tblue cursor-pointer hover:underline">
                Log in
              </span>
            </Link>
          </h2>
          <div className="w-96 max-w-full">
            <div className="w-full grid grid-cols-1 gap-3 my-6">
              <FormField
                label={"Email"}
                type={"email"}
                icon={<Mail color="white" />}
              />
              <FormField
                label={"Password"}
                type={"password"}
                icon={<Lock color="white" />}
              />
            </div>
            <div className="w-full flex flex-row gap-2 flex-wrap">
              <button
                onClick={() => signIn(discord.id)}
                className="w-full px-8 py-3 rounded-3xl text-white bg-discord-dark hover:bg-discord hover:shadow-[0_5px_40px_-15px_rgba(29,144,244,.3)] transition-colors"
              >
                Login with Discord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: `/browse`,
        permanent: false,
      },
    };
  }

  return {
    props: { providers },
  };
}
