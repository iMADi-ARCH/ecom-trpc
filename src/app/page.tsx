"use client";

import { trpc } from "@/trpc/client";

export default function Home() {
  const { data, isFetching } = trpc.hello.useQuery();

  return <main>{data}</main>;
}
