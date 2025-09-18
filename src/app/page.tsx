
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Zap, Bot, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';

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

const features = [
  {
    icon: <CreditCard className="w-8 h-8 mb-4 text-primary" />,
    title: 'Secure Virtual Cards',
    description: 'Create and manage virtual cards for safe online spending. Freeze, unfreeze, and set spending limits with a single tap.',
  },
  {
    icon: <Zap className="w-8 h-8 mb-4 text-primary" />,
    title: 'Instant Transfers',
    description: 'Send and receive money from friends and family instantly. No more waiting days for funds to clear.',
  },
  {
    icon: <Bot className="w-8 h-8 mb-4 text-primary" />,
    title: 'AI-Powered Payments',
    description: 'Use our AI-powered "Scan & Pay" to settle payments from QR codes effortlessly. Let our AI handle the details.',
  },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <AppLogo />
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col p-6 gap-6">
                  <AppLogo />
                  <Link href="#features" className="text-lg font-medium">Features</Link>
                  <Link href="/dashboard" className="text-lg font-medium">Dashboard</Link>
                  <div className="flex flex-col gap-2 mt-auto">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              The Future of Peer-to-Peer Payments
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              PeerPay offers a seamless, secure, and modern way to manage your finances. Send money, pay bills, and earn rewards, all from one place.
            </p>
            <Link href="/signup">
              <Button size="lg">Get Started for Free</Button>
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary/50 dark:bg-secondary/20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why You'll Love PeerPay</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                We've built a platform packed with features to make your financial life simpler and more secure.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6">
                  <CardHeader>
                    <div className="flex justify-center">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 md:py-32">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
             <div>
              <Image src="https://picsum.photos/seed/peerpay-app/600/400" alt="PeerPay Dashboard" width={600} height={400} className="rounded-lg shadow-2xl" data-ai-hint="app screenshot" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">A Dashboard That Works For You</h2>
              <p className="text-muted-foreground mb-6">
                Get an at-a-glance view of your available balance, manage your virtual cards, and see all your recent transactions in one clean interface. Our intuitive design makes navigating your finances a breeze.
              </p>
              <Link href="/dashboard">
                <Button variant="outline">Explore the Dashboard</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; 2024 PeerPay. All rights reserved.</p>
          <AppLogo />
        </div>
      </footer>
    </div>
  );
}
