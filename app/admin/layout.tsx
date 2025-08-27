"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  MessageSquare, 
  User, 
  FolderKanban, 
  Settings,
  GraduationCap,
  Trophy,
  Activity,
  Sun,
  Moon,
  ImageIcon
} from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

const sidebarNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Trophy },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Don't show sidebar on login page
  if (pathname.includes("/admin/auth/")) {
    return <ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="group/sidebar-wrapper flex min-h-svh w-full">
          <Sidebar>
            <SidebarHeader>
              <Link href="/admin" className="flex items-center gap-2 p-2">
                <h1 className="text-lg font-bold">Admin Panel</h1>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {sidebarNavItems.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === href}
                      tooltip={label}
                    >
                      <Link href={href}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <ThemeToggle />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex-auto">
            <div className="w-full h-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
