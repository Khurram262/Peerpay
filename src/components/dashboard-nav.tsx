'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
    label: 'Cards',
  },
  {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export function DashboardNav({ isMobile }: { isMobile: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
              pathname === item.href && 'bg-muted text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-muted-foreground transition-colors hover:text-foreground',
            pathname === item.href && 'text-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
