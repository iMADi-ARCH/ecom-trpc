import { Clerk } from "@clerk/backend";
import { prisma } from "./prisma";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType } from "@trpc/server";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  // return { req, res };
  const clerk = Clerk({ apiKey: process.env.CLERK_API_KEY });
  const userId = req.headers.authorization;
  await prisma.$connect();

  //If there is no session token, return null
  if (!userId) return { session: null, req, res, db: prisma };

  // otherwise, get the session
  const user = await clerk.users.getUser(userId);
  return {
    user,
    req,
    res,
    db: prisma,
  };
};

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
