import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "HELLO WORLD";
  }),
});

export type AppRouter = typeof appRouter;
