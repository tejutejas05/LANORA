import { Activity, Box, CheckCircle2, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppData } from "../hooks/useAppData"
import StatCard from "../components/StatCard"
import RunTable from "../components/RunTable"

export default function Dashboard() {
  const { data, loading, error } = useAppData();

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }
  
  if (error || !data) {
    return <div className="p-8 text-rose-500 text-sm">{error || "Failed to load dashboard data."}</div>;
  }

  const { stats, recentTests, storage, files } = data.dashboard;

  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="mb-8 border-b border-white/5 pb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">Overview</h3>
        <p className="text-neutral-500 text-sm mt-1 mb-6">Monitor your agent runs and sandbox performance.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Active Sandboxes" 
            value={stats.sandboxes} 
            subText="Manage isolated environments" 
            Icon={Box} 
          />
          <StatCard 
            title="Total Runtime" 
            value={stats.runtime} 
            subText="Cumulative execution time" 
            Icon={Activity} 
          />
          <StatCard 
            title="Active Agents" 
            value={stats.agents} 
            subText={`${storage} utilized • ${files} files`} 
            Icon={CheckCircle2} 
            iconColor="text-emerald-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[15px] font-bold text-white tracking-tight">Recent Runs</h3>
          <Link to="/dashboard/history" className="text-emerald-500 text-sm hover:text-emerald-400 transition-colors border-b border-emerald-500/30 font-medium">
            View all logs &rarr;
          </Link>
        </div>
        
        <RunTable runs={recentTests} />
      </div>
    </div>
  )
}
