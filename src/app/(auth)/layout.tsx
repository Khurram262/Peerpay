import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </>
  );
}
