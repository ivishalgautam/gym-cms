import { useQuery } from "@tanstack/react-query";

const fetchLeads = async () => {
  const { data } = await http().get(endpoints.leads.getAll);
  return data;
};

export default function useFetchLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });
}
