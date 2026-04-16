import { Activity } from "lucide-react"

export default function ResourceUsage() {
  return (
    <div className="flex flex-col h-full animate-fade-in-up items-center justify-center text-center pb-20" style={{ animationDuration: '0.4s' }}>
      <Activity className="w-10 h-10 text-neutral-800 mb-4" />
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Resource Usage</h3>
      <p className="text-neutral-500 text-sm max-w-sm">This section is fully fleshed out in the live application.</p>
    </div>
  )
}
