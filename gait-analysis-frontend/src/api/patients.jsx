import { useQuery } from "@tanstack/react-query";

// Simulated patient data (Replace with real API later)
const fetchPatients = async () => {
  console.log("Fetching Patients...");
  
  const mockPatients = [
    { id: 1, name: "Chamath Rupasinghe", age: 23 },
    { id: 2, name: "Haritha Bandara", age: 24 },
    { id: 3, name: "Yohan Johnson", age: 23 },
    { id: 4, name: "Chamodi Senaratne", age: 23 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Returning Mock Patients:", mockPatients);
      resolve(mockPatients);
    }, 1000); // Simulated delay for testing
  });
};

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],  // ✅ Correct way in React Query v5
    queryFn: fetchPatients,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching when switching tabs
  });
};
