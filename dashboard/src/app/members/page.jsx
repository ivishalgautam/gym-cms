"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

async function fetchMembers() {
  const { data } = await http().get(endpoints.members.getAll);
  return data;
}

export default function Page() {
  const router = useRouter();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const handleNavigate = (href) => {
    router.push(href);
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <DataTable columns={columns(handleNavigate)} data={data} />{" "}
    </div>
  );
}
