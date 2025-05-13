"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Check, LogOut, Menu, Plus, Settings, User } from "lucide-react"

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

// Define notification type
type Notification = {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Default notifications for new users
const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to Product Showcase!",
    message: "Get started by creating your first product showcase.",
    timestamp: new Date(),
    read: false,
  },
  {
    id: "2",
    title: "Explore Templates",
    message: "Check out our premium templates to showcase your products.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
  },
  {
    id: "3",
    title: "Complete Your Profile",
    message: "Update your profile information to personalize your experience.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
]

export function DashboardHeader({
  heading,
  description,
  children,
}: {
  heading: string
  description: string
  children?: React.ReactNode
}) {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Load notifications from localStorage or use defaults for new users
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications-${user.id}`)
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      } else {
        // Set default notifications for new users
        setNotifications(defaultNotifications)
      }
    }
  }, [user])

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(notifications))
    }
  }, [notifications, user])

  // Mark notifications as read when dropdown is opened
  const handleNotificationsOpen = (open: boolean) => {
    setNotificationsOpen(open)

    if (open && notifications.some((n) => !n.read)) {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
      setNotifications(updatedNotifications)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
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
          <DropdownMenu open={notificationsOpen} onOpenChange={handleNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#A67B5B] hover:text-[#6F4E37] hover:bg-[#FED8B1]/10"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-[#FED8B1]/30 text-[#6F4E37] px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-default">
                      <div className="flex w-full justify-between items-start">
                        <span className="font-medium text-sm">{notification.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatRelativeTime(new Date(notification.timestamp))}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{notification.message}</span>
                      {!notification.read && (
                        <span className="mt-1 text-xs flex items-center text-[#6F4E37]">
                          <Check className="h-3 w-3 mr-1" /> Marked as read
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center text-center cursor-pointer">
                <Link href="/dashboard/notifications" className="text-xs text-[#6F4E37]">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {children}
        </div>
      </div>
    </header>
  )
}
