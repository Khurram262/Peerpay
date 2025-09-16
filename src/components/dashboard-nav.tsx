'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/dashboard/transactions',
    icon: ArrowRightLeft,
    label: 'Transactions',
  },
  {
    href: '/dashboard/cards',
    icon: CreditCard,
    label: 'Virtual Cards',
  },
  {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
