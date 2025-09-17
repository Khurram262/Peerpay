
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CreditCard, Receipt, Gift, BrainCircuit, Home, Settings, History, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/transactions', icon: History, label: 'History' },
  { href: '/dashboard/cards', icon: CreditCard, label: 'Cards' },
  { href: '/dashboard/payments', icon: Receipt, label: 'Payments' },
  { href: '/dashboard/rewards', icon: Gift, label: 'Rewards' },
  { href: '/dashboard/insights', icon: BrainCircuit, label: 'Insights' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const AppLogo = () => (
    <Link
        href="/dashboard"
        className="flex items-center gap-2 font-semibold"
    >
        <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
        fill="currentColor"
        >
        <title>PeerPay</title>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.88 18.514V5.486h2.16c1.359 0 2.463.315 3.312.945.85.63 1.274 1.516 1.274 2.658 0 1.05-.38 1.91-1.139 2.58-.759.67-1.78.981-3.063.981h-2.544v6.864H9.12zm2.16-8.244h2.467c.72 0 1.29-.183 1.71-.55.42-.367.63- .885.63-1.554 0-1.17-.635-1.755-1.908-1.755h-2.899v3.859z" />
        </svg>
        <span className="group-data-[collapsible=icon]:hidden">
        PeerPay
        </span>
    </Link>
)

const MobileNav = () => {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <AppLogo />
                    {navItems.map((item) => (
                         <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === item.href ? 'text-primary bg-muted' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

const DesktopNav = () => {
    const pathname = usePathname();
    return (
        <nav className="hidden md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <AppLogo />
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                {item.label}
                </Link>
            ))}
        </nav>
    )
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 z-50">
                <MobileNav />
                <DesktopNav />
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
                    <ThemeToggle />
                    <UserNav />
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
            </main>
      </div>
  );
}
