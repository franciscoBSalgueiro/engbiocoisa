import { PrismaAdapter } from "@next-auth/prisma-adapter";
import "next-auth";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { prisma } from "../../../prisma/prisma";

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
  }

  interface Session {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // callbacks: {
  //   async session({ session, token, user }) {
  //     // Send properties to the client, like an access_token from a provider.
  //     session.user.id = user.id;
  //     session.user.role = user.role;
  //     session.user.username = user.username;
  //     return session;
  //   },
  // },
};

export default NextAuth(authOptions);
