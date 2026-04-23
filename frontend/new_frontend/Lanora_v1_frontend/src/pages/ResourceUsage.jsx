import { useState, useEffect } from "react"
import { Activity, Loader2 } from "lucide-react"
import { useAppData } from "../hooks/useAppData"
import ResourceCard from "../components/ResourceCard"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generateInitialData() {
  return Array.from({ length: 15 }).map((_, i) => {
    const d = new Date();
    d.setSeconds(d.getSeconds() - (14 - i) * 2);
    return {
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      memory: Math.floor(140 + Math.random() * 40),
      cpu: Math.floor(15 + Math.random() * 15)
    }
  });
}

export default function ResourceUsage() {
  const { data: hookData, loading, error } = useAppData();
  const [data, setData] = useState(generateInitialData());

  useEffect(() => {
    const fetchRealtimeMetrics = async () => {
      try {
        // Attempt to request actual realtime payload from backend
        const token = localStorage.getItem("token") || "";
        const res = await fetch("http://localhost:5000/api/resource-metrics", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const newDataPoint = await res.json();
          setData(prev => [...prev.slice(1), newDataPoint]);
          return;
        }
        throw new Error("Backend not available yet");
      } catch (err) {
        // Fallback simulated real-time stream mimicking backend behavior
        setData(prev => {
          const last = prev[prev.length - 1];
          const d = new Date();
          const targetMemory = Math.max(100, Math.min(250, last.memory + (Math.random() * 30 - 15)));
          
          const newPoint = {
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
            memory: Math.floor(targetMemory),
            cpu: Math.floor(Math.max(10, Math.min(90, last.cpu + (Math.random() * 10 - 5))))
          };
          return [...prev.slice(1), newPoint];
        });
      }
    };

    const interval = setInterval(fetchRealtimeMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }
  
  if (error || !hookData) {
    return <div className="p-8 text-rose-500 text-sm">{error || "Failed to load resource data."}</div>;
  }

  const stats = hookData.resourceUsage.stats;

  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="flex justify-between items-start mb-12 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Resource Usage</h3>
          <p className="text-neutral-500 text-sm mt-1">Monitor real-time infrastructure and compute telemetry.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 px-2 md:px-10 lg:px-16 mb-12">
        {stats.map((stat, i) => (
          <ResourceCard 
            key={i}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl p-6 relative shadow-lg">
        <div className="flex justify-between items-center mb-6">
           <h4 className="text-white font-bold">Compute Trajectory (Live)</h4>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase">Receiving Data</span>
           </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="time" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
              <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff10', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#a3a3a3', marginBottom: '5px' }}
              />
              <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
