import { Activity, Box, CheckCircle2 } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="mb-8 border-b border-white/5 pb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">Overview</h3>
        <p className="text-neutral-500 text-sm mt-1 mb-6">Monitor your agent runs and sandbox performance.</p>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-[#111111] rounded-xl border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-400 flex items-center gap-2"><Box className="w-4 h-4"/> Active Sandboxes</span>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold">1 pending start</div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-400 flex items-center gap-2"><Activity className="w-4 h-4"/> Total Runs (24h)</span>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">1,248</div>
              <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold">+12% from yesterday</div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Success Rate</span>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">94.2%</div>
              <div className="text-[10px] text-emerald-500/70 mt-1 uppercase tracking-wider font-semibold">Across all active agents</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[15px] font-bold text-white tracking-tight">Recent Runs</h3>
          <span className="text-emerald-500 text-sm hover:underline cursor-pointer border-b border-emerald-500/30 font-medium">View all logs &rarr;</span>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-xl flex-1 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap hidden md:table">
            <thead className="bg-[#111111] border-b border-white/5 text-neutral-400 text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Run ID</th>
                <th className="px-6 py-4 font-medium">Sandbox</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Time (Local)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              <tr className="hover:bg-white/[0.02] cursor-default">
                <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4">run-8f92j</td>
                <td className="px-6 py-4 text-sm font-medium">agent-research</td>
                <td className="px-6 py-4"><span className="text-amber-500 text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Running</span></td>
                <td className="px-6 py-4 text-neutral-500 text-xs">12s</td>
                <td className="px-6 py-4 text-neutral-500 text-xs">2m ago</td>
              </tr>
              <tr className="hover:bg-white/[0.02] cursor-default">
                <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4">run-3x8f1</td>
                <td className="px-6 py-4 text-sm font-medium">code-assistant</td>
                <td className="px-6 py-4"><span className="text-emerald-500 text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center w-fit">Success</span></td>
                <td className="px-6 py-4 text-neutral-500 text-xs">1m 45s</td>
                <td className="px-6 py-4 text-neutral-500 text-xs">15m ago</td>
              </tr>
              <tr className="hover:bg-white/[0.02] cursor-default">
                <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4">run-9c2b4</td>
                <td className="px-6 py-4 text-sm font-medium">data-pipeline</td>
                <td className="px-6 py-4"><span className="text-rose-500 text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 rounded border border-rose-500/20 flex items-center w-fit">Error</span></td>
                <td className="px-6 py-4 text-neutral-500 text-xs">45s</td>
                <td className="px-6 py-4 text-neutral-500 text-xs">1h ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
