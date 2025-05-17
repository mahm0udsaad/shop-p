"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Menu, Plus, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { NotificationBell } from "./notification-bell"
import { Notification } from "@/types/notifications"

interface DashboardHeaderProps {
  heading: string
  description: string
  notifications?: Notification[]
  unreadCount?: number
  userId?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  description,
  notifications = [],
  unreadCount = 0,
  userId,
  children,
}: DashboardHeaderProps) {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background w-full">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56">
              <nav className="grid gap-4 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-[#6F4E37]">
                  <span className="bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-transparent bg-clip-text">
                    Product
                  </span>
                  <span className="text-[#A67B5B]">Showcase</span>
                </Link>
                <Link href="/dashboard" className="hover:text-[#6F4E37] text-[#A67B5B] transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/products" className="hover:text-[#6F4E37] text-[#A67B5B] transition-colors">
                  Products
                </Link>
                <Link href="/dashboard/orders" className="hover:text-[#6F4E37] text-[#A67B5B] transition-colors">
                  Orders
                </Link>
                <Link href="/dashboard/analytics" className="hover:text-[#6F4E37] text-[#A67B5B] transition-colors">
                  Analytics
                </Link>
                <Link href="/dashboard/settings" className="hover:text-[#6F4E37] text-[#A67B5B] transition-colors">
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-lg font-semibold text-[#6F4E37]">
            <span className="bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-transparent bg-clip-text">Product</span>
            <span className="text-[#A67B5B]">Showcase</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Show notification bell if userId is available */}
          {userId && (
            <NotificationBell 
              userId={userId}
              initialNotifications={notifications}
              initialUnreadCount={unreadCount}
            />
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-1 text-[#6F4E37] border-[#A67B5B]/30 hover:bg-[#FED8B1]/10"
            onClick={() => router.push("/dashboard/new")}
          >
            <Plus className="h-4 w-4" />
            New Product
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-[#A67B5B]/30 text-[#6F4E37]">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.full_name || user?.email}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="container py-4">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#6F4E37]">{heading}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </header>
  )
}
