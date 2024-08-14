import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchTrainers = async () => {
  const { data } = await http().get(
    `${endpoints.trainers.getAll}?type=personal`,
  );
  return data;
};

export default function useFetchTrainers() {
  return useQuery({
    queryKey: ["trainers"],
    queryFn: fetchTrainers,
  });
}
