import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";

async function fetchData() {
  const { data } = await http().get(endpoints.memberships.getAll);
  return data;
}

export default function useFetchMemberships() {
  return useQuery({ queryKey: ["memberships"], queryFn: fetchData });
}
