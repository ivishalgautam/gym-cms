import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";

async function fetchData() {
  const { data } = await http().get(endpoints.membershipPerk.getAll);
  return data?.map(({ content: label, id: value }) => ({ label, value }));
}

export default function useFetchMembershipPerks() {
  return useQuery({ queryKey: ["membership-perks"], queryFn: fetchData });
}
