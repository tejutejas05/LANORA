import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/api";

//  helper: fetch with JWT + timeout
const fetchWithAuth = async (url, options = {}, timeout = 5000) => {
  const token = localStorage.getItem("token") || "";

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(id);

    if (!res.ok) {
      throw new Error(`API failed: ${url} (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export function useAppData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled([
          fetchWithAuth(`${BASE_URL}/dashboard`),
          fetchWithAuth(`${BASE_URL}/sandboxes`),
          fetchWithAuth(`${BASE_URL}/history`),
          fetchWithAuth(`${BASE_URL}/resources`)
        ]);

        //  Extract safely
        const dashboard = results[0].status === "fulfilled" ? results[0].value : {};
        const sandboxes = results[1].status === "fulfilled" ? results[1].value : [];
        const history = results[2].status === "fulfilled" ? results[2].value : [];
        const resources = results[3].status === "fulfilled" ? results[3].value : {};

        //  Format for frontend (matches your components)
        const formattedData = {
          dashboard: {
            stats: {
              sandboxes: dashboard.active_sandboxes ?? "--",
              runtime: dashboard.total_runtime ?? "--",
              agents: dashboard.active_agents ?? "--",
            },
            recentTests: history.slice(0, 5),
            storage: "--",
            files: "--",
          },

          sandboxes: {
            stats: {
              created: sandboxes.length || 0,
              runtime: sandboxes.reduce((sum, s) => sum + (s.runtime || 0), 0),
              storage: sandboxes.reduce((sum, s) => sum + (s.storage || 0), 0),
            },
            history: sandboxes,
          },

          resourceUsage: {
            stats: [
              { title: "Memory Usage", value: resources.memory_mb ? `${resources.memory_mb} MB` : "--" },
              { title: "Active Runtime", value: resources.runtime ? `${resources.runtime}s` : "--" },
              { title: "Tokens Used", value: resources.tokens ?? "--" },
              { title: "GPU Usage", value: resources.gpu ? `${resources.gpu}%` : "--" }
            ]
          },

          testHistory: {
            tests: history
          }
        };

        console.log("Final Data:", formattedData);
        setData(formattedData);

        // ⚠️ If any API failed → show warning but not break UI
        if (results.some(r => r.status === "rejected")) {
          setError("Some data failed to load");
        }

      } catch (err) {
        console.error("Critical error:", err);
        setError("Backend connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { data, loading, error };
}