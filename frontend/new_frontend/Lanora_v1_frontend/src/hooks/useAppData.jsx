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
        const token = localStorage.getItem("token") || "";
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch data from backend. Falling back to mock data.");
        }
        
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error("Backend not available:", err);
        setError("Warning: Cannot connect to Go backend server over localhost:5000");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
