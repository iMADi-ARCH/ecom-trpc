import { AuthCredentialsValidator } from "@/validators/auth-credentials";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  createUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      console.log("TODO CREATE USER", input);
    }),
});
