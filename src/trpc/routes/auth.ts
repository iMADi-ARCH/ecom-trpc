import { AuthCredentialsValidator } from "../../validators/auth-credentials";
import { prisma } from "../prisma";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  createUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const d = await prisma.user.create({
        data: { clerkUserId: "adlfk", email: "aldfkj", name: "johnny" },
      });
      console.log("TODO CREATE USER", input);
    }),
});
