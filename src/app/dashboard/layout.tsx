
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Home, CreditCard, History, Settings, Bell, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const AppLogo = () => (
    <Link
        href="/"
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
        <span >
        PeerPay
        </span>
    </Link>
)

const navItems = [
    { href: '/dashboard', icon: Wallet, label: 'Home' },
    { href: '/dashboard/cards', icon: CreditCard, label: 'Cards' },
    { href: '/dashboard/transactions', icon: History, label: 'History' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur-sm">
            <div className="grid h-16 grid-cols-4 items-center justify-center text-xs">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                             <div className={cn(
                                "flex flex-col items-center gap-1 p-2 transition-colors",
                                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 z-50">
              <div className="flex items-center gap-2">
                 <AppLogo />
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-10">
                {navItems.map(item => (
                  <Link key={item.label} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>
                ))}
              </div>
              <div className="flex w-full items-center gap-2 md:ml-auto md:gap-4 justify-end">
                  <ThemeToggle />
                   <Link href="#" className="relative">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-[10px]">3</Badge>
                   </Link>
                  <UserNav />
              </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 pb-24 md:pb-6">
          {children}
          </main>
          <MobileNav />
      </div>
  );
}
