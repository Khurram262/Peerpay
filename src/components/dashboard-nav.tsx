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

export function DashboardNav({ isMobile }: { isMobile: boolean }) {
  const pathname = usePathname();

  const navLinks = navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'text-muted-foreground transition-colors hover:text-foreground',
          pathname === item.href && 'text-foreground',
           isMobile && 'flex items-center gap-4 rounded-xl px-3 py-2 text-lg',
           isMobile && pathname === item.href && 'bg-muted',
           !isMobile && 'text-sm'
        )}
      >
        <item.icon className={cn('h-5 w-5', isMobile && 'h-6 w-6')} />
        <span className={cn(isMobile && 'w-full')}>{item.label}</span>
      </Link>
  ));

  if (isMobile) {
    return <>{navLinks}</>
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
