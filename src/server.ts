import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { nextApp, nextHandler } from "./next-utils";
import { inferAsyncReturnType } from "@trpc/server";
import { Clerk, WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import { prisma } from "./trpc/prisma";
import { createContext } from "./trpc/context";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  app.post(
    "/api/webhooks",
    bodyParser.raw({ type: "application/json" }),
    async function (req, res) {
      // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided

      const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
      if (!WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env");
      }

      // Grab the headers and body
      const headers = req.headers;
      const payload = req.body;

      // Get the Svix headers for verification
      const svix_id = headers["svix-id"] as string;
      const svix_timestamp = headers["svix-timestamp"] as string;
      const svix_signature = headers["svix-signature"] as string;

      // If there are missing Svix headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
          status: 400,
        });
      }

      // Initiate Svix
      const wh = new Webhook(WEBHOOK_SECRET);

      let evt: WebhookEvent;

      // Attempt to verify the incoming webhook
      // If successful, the payload will be available from 'evt'
      // If the verification fails, error out and  return error code
      try {
        evt = wh.verify(payload, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as WebhookEvent;
      } catch (err: any) {
        // Console log and return error
        console.log("Webhook failed to verify. Error:", err.message);
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Grab the ID and TYPE of the Webhook
      const { id } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.created") {
        await prisma.user.create({
          data: {
            clerkUserId: evt.data.id,
            email: evt.data.email_addresses[0].email_address,
            name: evt.data.first_name + " " + evt.data.last_name,
          },
        });
      }

      console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
      // Console log the full payload to view
      console.log("Webhook body:", evt.data);

      return res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    }
  );
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
