import { z } from "zod";

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be of atleast 6 characters long"),
});

export type AuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>;
