import { Box, Play, XCircle, Terminal as TerminalIcon } from "lucide-react"

export default function Sandboxes() {
  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Sandboxes</h3>
          <p className="text-neutral-500 text-sm mt-1">Manage your isolated agent environments.</p>
        </div>
        <button className="bg-emerald-500 text-black px-4 py-2 rounded font-bold text-sm hover:bg-emerald-400 transition-colors">+ New Sandbox</button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6 group flex flex-col justify-between h-[180px] hover:border-white/10 transition-colors cursor-pointer relative">
           <div className="flex justify-between items-start">
              <Box className="w-8 h-8 text-amber-500/80" />
              <span className="text-amber-500 text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">Running</span>
           </div>
           <div>
             <h4 className="text-white font-bold text-[15px]">agent-research</h4>
             <div className="text-[11px] font-medium text-neutral-500 mt-1">Runtime: Node.js 18</div>
             <div className="text-[10px] text-neutral-400 mt-4 bg-white/5 w-fit px-2 py-1 rounded font-medium border border-white/5">Created 2 days ago</div>
           </div>
           <div className="absolute bottom-5 right-5 flex gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded border border-white/5 hover:bg-white/10 text-white"><TerminalIcon className="w-3.5 h-3.5" /></div>
              <div className="w-8 h-8 flex items-center justify-center bg-rose-500/10 rounded border border-rose-500/20 hover:bg-rose-500/20 text-rose-500"><XCircle className="w-3.5 h-3.5" /></div>
           </div>
        </div>
        
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6 group flex flex-col justify-between h-[180px] hover:border-white/10 transition-colors cursor-pointer relative">
           <div className="flex justify-between items-start">
              <Box className="w-8 h-8 text-neutral-500/80" />
              <span className="text-neutral-500 text-[10px] font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded">Stopped</span>
           </div>
           <div>
             <h4 className="text-white font-bold text-[15px]">code-assistant</h4>
             <div className="text-[11px] font-medium text-neutral-500 mt-1">Runtime: Python 3.11</div>
             <div className="text-[10px] text-neutral-400 mt-4 bg-white/5 w-fit px-2 py-1 rounded font-medium border border-white/5">Created 5 days ago</div>
           </div>
           <div className="absolute bottom-5 right-5 flex gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded border border-white/5 hover:bg-white/10 text-emerald-500"><Play className="w-3.5 h-3.5" /></div>
              <div className="w-8 h-8 flex items-center justify-center bg-rose-500/10 rounded border border-rose-500/20 hover:bg-rose-500/20 text-rose-500"><XCircle className="w-3.5 h-3.5" /></div>
           </div>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-xl p-6 group flex flex-col justify-between h-[180px] hover:border-white/10 transition-colors cursor-pointer relative">
           <div className="flex justify-between items-start">
              <Box className="w-8 h-8 text-neutral-500/80" />
              <span className="text-neutral-500 text-[10px] font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded">Stopped</span>
           </div>
           <div>
             <h4 className="text-white font-bold text-[15px]">data-pipeline</h4>
             <div className="text-[11px] font-medium text-neutral-500 mt-1">Runtime: Python 3.10</div>
             <div className="text-[10px] text-neutral-400 mt-4 bg-white/5 w-fit px-2 py-1 rounded font-medium border border-white/5">Created 1 week ago</div>
           </div>
           <div className="absolute bottom-5 right-5 flex gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded border border-white/5 hover:bg-white/10 text-emerald-500"><Play className="w-3.5 h-3.5" /></div>
              <div className="w-8 h-8 flex items-center justify-center bg-rose-500/10 rounded border border-rose-500/20 hover:bg-rose-500/20 text-rose-500"><XCircle className="w-3.5 h-3.5" /></div>
           </div>
        </div>
      </div>
    </div>
  )
}
