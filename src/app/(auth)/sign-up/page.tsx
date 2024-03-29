"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { ZodError } from "zod";
import { AuthCredentialsValidator } from "@/validators/auth-credentials";
import { useForm } from "react-hook-form";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

type Props = {};

const SignUp = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: createUser, isLoading } = trpc.auth.createUser.useMutation({
    onError: (error) => {
      if (error.data?.zodError) {
        toast.error(error.data.zodError.issues[0].message);
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const onSubmit = ({ email, password }: AuthCredentialsValidator) => {
    createUser({ email, password });
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <CardContent>
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            className={cn({
              "focus-visible:ring-red-500": errors.email,
            })}
            name="email"
            id="email"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            className={cn({
              "focus-visible:ring-red-500": errors.password,
            })}
            type="password"
            name="password"
            id="password"
          />
        </CardContent>
        <CardFooter className="flex-col md:flex-row items-start">
          <Button disabled={isLoading} className="">
            Sign Up
          </Button>
          <Link
            className={buttonVariants({ variant: "link" })}
            href={"/sign-in"}
          >
            Already have an account? Sign In
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUp;
