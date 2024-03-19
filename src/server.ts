import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { nextApp, nextHandler } from "./next-utils";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return { req, res };
};

const start = async () => {
  app.use((req, res) => nextHandler(req, res));
  nextApp.prepare().then(() => {
    app.listen(PORT, () => {
      console.log(`Next.js App URL ${process.env.NEXT_PUBLIC_SERVER_URL}`);
    });
  });
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
};

start();
