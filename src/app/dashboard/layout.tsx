
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 z-50">
                <div className="flex h-full items-center">
                  <AppLogo />
                </div>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
                    <ThemeToggle />
                    <UserNav />
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {children}
            </main>
      </div>
  );
}
