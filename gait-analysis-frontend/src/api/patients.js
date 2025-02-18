import { useQuery } from "@tanstack/react-query";

const fetchPatients = async () => {
  const response = await fetch("/api/patients");
  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
};

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
};
