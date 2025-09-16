
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Settings,
  Receipt,
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

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
    label: 'Cards',
  },
  {
    href: '/dashboard/payments',
    icon: Receipt,
    label: 'Payments',
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
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
