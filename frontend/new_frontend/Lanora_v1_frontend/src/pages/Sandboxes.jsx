import { useAppData } from "../hooks/useAppData"
import SandboxCard from "../components/SandboxCard"
import StatCard from "../components/StatCard"
import { Box, HardDrive, Clock, Loader2 } from "lucide-react"

export default function Sandboxes() {
  const { data, loading, error } = useAppData();

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }
  
  if (error || !data) {
    return <div className="p-8 text-rose-500 text-sm">{error || "Failed to load sandboxes data."}</div>;
  }

  const { stats, history } = data.sandboxes;

  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Sandboxes</h3>
          <p className="text-neutral-500 text-sm mt-1">Manage your isolated agent environments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Created Sandboxes" value={stats.created} Icon={Box} />
        <StatCard title="Total Runtime" value={stats.runtime} Icon={Clock} />
        <StatCard title="Storage Used" value={stats.storage} Icon={HardDrive} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {history.map((sb, i) => (
          <SandboxCard
            key={sb.id || i}
            name={sb.name}
            status={sb.status}
            started={sb.started}
            duration={sb.duration}
          />
        ))}
      </div>
    </div>
  )
}
