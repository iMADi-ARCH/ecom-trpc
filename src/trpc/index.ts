import { authRouter } from "./routes/auth";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
