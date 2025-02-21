import { useQuery } from "@tanstack/react-query";

// Simulated patient data (Replace with real API later)
const fetchPatients = async () => {
  console.log("Fetching Patients...");
  
  const mockPatients = [
    { id: 1, name: "John Doe", age: 45 },
    { id: 2, name: "Jane Smith", age: 52 },
    { id: 3, name: "Mark Johnson", age: 39 },
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
