import { Outlet, Link } from "react-router-dom"
import { Terminal } from "lucide-react"

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
          <Link to="/" className="flex items-center gap-2 font-bold font-mono text-lg">
            <Terminal className="h-5 w-5 text-emerald-500" />
            <span>Lanora</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors"
              >
                Register
              </Link>
              {/* <Link 
                to="/dashboard" 
                className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors ml-4"
              >
                Dashboard Area (Demo)
              </Link> */}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
