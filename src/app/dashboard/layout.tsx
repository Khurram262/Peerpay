

'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Home, CreditCard, History, Settings, Bell, Wallet, X, AppWindow } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AppLogo = () => (
    <div
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
        <span className="hidden md:inline-block">
        PeerPay
        </span>
    </div>
)

const navItems = [
    { href: '/dashboard', icon: Wallet, label: 'Home' },
    { href: '/dashboard/cards', icon: CreditCard, label: 'Cards' },
    { href: '/dashboard/transactions', icon: History, label: 'History' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

const initialNotifications = [
    {
        id: 1,
        title: 'New login from another device.',
        description: '1 hour ago',
    },
    {
        id: 2,
        title: 'Your subscription for Netflix has been paid.',
        description: '2 hours ago',
    },
    {
        id: 3,
        title: 'You received $50 from John Doe.',
        description: '1 day ago',
    },
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
  const [notifications, setNotifications] = useState(initialNotifications);
  const pathname = usePathname();

  const handleClearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };
  
  return (
      <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 z-50">
              <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                  <AppLogo />
                </Link>
                {navItems.map(item => (
                  <Link key={item.label} href={item.href} className={cn("transition-colors hover:text-foreground", pathname === item.href ? "text-foreground" : "text-muted-foreground")}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
                  <ThemeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            {notifications.length > 0 && 
                                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-[10px]">{notifications.length}</Badge>
                            }
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="end">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length > 0 ? (
                            <>
                                {notifications.map((notification) => (
                                    <DropdownMenuItem key={notification.id} className="flex items-start gap-1 group">
                                        <div className="flex-1">
                                            <p className="font-medium whitespace-normal">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                                        </div>
                                         <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClearNotification(notification.id);
                                            }}
                                         >
                                            <X className="h-4 w-4" />
                                         </Button>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleClearAll} className="justify-center text-sm text-primary cursor-pointer">
                                   Clear all notifications
                                </DropdownMenuItem>
                            </>
                        ) : (
                             <div className="p-4 text-center text-sm text-muted-foreground">
                                You have no new notifications.
                             </div>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
