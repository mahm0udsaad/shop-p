import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-[#6F4E37]">Product</span>
            <span className="text-[#A67B5B]">Showcase</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/dashboard" className="text-[#6F4E37] font-medium">
              Dashboard
            </a>
            <a href="/dashboard/orders" className="text-[#A67B5B]">
              Orders
            </a>
            <a href="/dashboard/settings" className="text-[#A67B5B]">
              Settings
            </a>
            <button className="border-[#A67B5B] text-[#6F4E37] px-3 py-1 rounded-md border text-sm">Log Out</button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6 bg-[#FED8B1]/10">
        <div className="grid gap-6">{children}</div>
      </main>
    </div>
  )
}
