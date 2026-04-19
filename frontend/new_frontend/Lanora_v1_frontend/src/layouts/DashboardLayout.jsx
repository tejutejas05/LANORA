import { NavLink, Outlet } from "react-router-dom"
import { 
  Terminal as TerminalIcon, 
  Activity, 
  Box, 
  HardDrive,
  Key,
  Bell,
  Search
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Sandboxes', href: '/dashboard/sandboxes', icon: Box },
  { name: 'Test History', href: '/dashboard/history', icon: HardDrive },
  { name: 'Resource Usage', href: '/dashboard/resources', icon: Activity },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-sans select-none">
      
      {/* Topbar */}
      <div className="h-14 bg-[#0a0a0a] border-b border-white/5 flex items-center px-6 justify-between z-20 shrink-0">
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-tight text-lg">
             <TerminalIcon className="w-5 h-5"/>
             Lanora
           </div>
           <div className="ml-8 hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] uppercase font-mono text-neutral-400 font-bold tracking-wider">
             cli connected <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
           </div>
         </div>
         <div className="flex items-center gap-6 text-neutral-400">
            <Search className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <Bell className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 border-r border-white/5 bg-[#0a0a0a] p-4 hidden md:flex flex-col z-10 text-sm shrink-0">
           <div className="space-y-1 mt-4 font-medium text-neutral-400">
             {navigation.map((item) => (
               <NavLink
                 key={item.name}
                 to={item.href}
                 end={item.href === '/dashboard'}
                 className={({ isActive }) =>
                   `flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                     isActive ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'
                   }`
                 }
               >
                 <item.icon className="h-4 w-4"/> {item.name}
               </NavLink>
             ))}
           </div>
           <div className="mt-auto space-y-1 mb-4 font-medium text-neutral-400">
             <NavLink
               to="/dashboard/settings"
               className={({ isActive }) =>
                 `flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                   isActive ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'
                 }`
               }
             >
               <Key className="h-4 w-4"/> Settings
             </NavLink>
           </div>
        </div>

        {/* Main Content Component */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
