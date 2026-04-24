import { useState, useEffect } from "react";

export function useAppData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        const res = await fetch("http://localhost:5000/api/dashboard");
      
        
        if (!res.ok) {
          throw new Error("Failed to fetch data from backend. Falling back to mock data.");
        }
        
        const json= await res.json();

        const formattedData = {
          dashboard: {
            stats: {
              sandboxes: json.active_sandboxes,
              runtime: json.total_runtime,
              agents: json.active_agents,
            },
            recentTests: [], 
            storage: "--",
            files: "--",
          },
        };

       console.log("Mapped Data:", formattedData);
        setData(formattedData);

      } catch (err) {
        console.error(err);
        setError("Cannot connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
