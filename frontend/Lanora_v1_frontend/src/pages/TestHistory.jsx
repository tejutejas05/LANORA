import { Search, Filter } from "lucide-react"

export default function TestHistory() {
  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="flex justify-between items-start mb-8 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Test History</h3>
          <p className="text-neutral-500 text-sm mt-1">Review logs and execution results from past runs.</p>
        </div>
      </div>
      <div className="flex gap-4 items-center mb-6">
         <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-md text-sm text-neutral-400 flex-1">
           <Search className="w-4 h-4" /> Search run ID or sandbox name...
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-md text-sm text-white font-medium hover:bg-white/10 cursor-pointer transition-colors">
           <Filter className="w-4 h-4" /> Filter
         </div>
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
              <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4 pointer-events-none">run-8f92j</td>
              <td className="px-6 py-4 text-sm font-medium">agent-research</td>
              <td className="px-6 py-4"><span className="text-amber-500 text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Running</span></td>
              <td className="px-6 py-4 text-neutral-500 text-xs">12s</td>
              <td className="px-6 py-4 text-neutral-500 text-xs">2m ago</td>
            </tr>
            <tr className="hover:bg-white/[0.02] cursor-default">
              <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4 pointer-events-none">run-3x8f1</td>
              <td className="px-6 py-4 text-sm font-medium">code-assistant</td>
              <td className="px-6 py-4"><span className="text-emerald-500 text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center w-fit">Success</span></td>
              <td className="px-6 py-4 text-neutral-500 text-xs">1m 45s</td>
              <td className="px-6 py-4 text-neutral-500 text-xs">15m ago</td>
            </tr>
            <tr className="hover:bg-white/[0.02] cursor-default">
              <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4 pointer-events-none">run-9c2b4</td>
              <td className="px-6 py-4 text-sm font-medium">data-pipeline</td>
              <td className="px-6 py-4"><span className="text-rose-500 text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 rounded border border-rose-500/20 flex items-center w-fit">Error</span></td>
              <td className="px-6 py-4 text-neutral-500 text-xs">45s</td>
              <td className="px-6 py-4 text-neutral-500 text-xs">1h ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
