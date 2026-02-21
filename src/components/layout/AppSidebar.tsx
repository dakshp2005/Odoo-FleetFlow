'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">FF</span>
          </div>
          <div>
            <p className="font-semibold text-sm leading-none">FleetFlow</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Fleet Management</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href} className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: user info */}
      <SidebarFooter className="border-t px-4 py-3">
        <p className="text-xs text-muted-foreground">Fleet Manager</p>
      </SidebarFooter>
    </Sidebar>
  )
}
