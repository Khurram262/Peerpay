
'use client';

import {
  ArrowUp,
  UserPlus,
  PlusCircle,
  ScanLine,
  ArrowRight,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { wallet, transactions, setWallet, type Wallet } from '@/lib/data';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts"
import { QrPaymentForm } from '@/components/qr-payment-form';
import { AnimatedVirtualCard } from '@/components/animated-virtual-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { initialVirtualCards } from '@/lib/data';
import type { VirtualCard, User } from '@/lib/data';
import Link from 'next/link';
import { user as initialUser } from '@/lib/data';
import { format, parseISO, subDays } from 'date-fns';

const chartData = [
  { date: format(subDays(new Date(), 6), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
  { date: format(subDays(new Date(), 5), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
  { date: format(subDays(new Date(), 4), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
  { date: format(subDays(new Date(), 3), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
  { date: format(subDays(new Date(), 2), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
  { date: format(subDays(new Date(), 1), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
  { date: format(new Date(), "MMM d"), total: Math.floor(Math.random() * 200) + 50 },
]

function QuickActionButton({ icon: Icon, label, href, onAction }: { icon: React.ElementType, label: string, href?: string, onAction?: () => void }) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 p-4 w-full transition-colors h-full">
            <div className="p-3 bg-background rounded-full shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }
    
    return <button onClick={onAction} className="w-full">{content}</button>
}


export default function DashboardPage() {
  const [user, setUser] = useState<User>(initialUser);
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [currentWallet, setCurrentWallet] = useState<Wallet>(wallet);
  const [isClient, setIsClient] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      
      const storedCards = localStorage.getItem('virtualCards');
      if (storedCards) {
        try {
          const parsedCards = JSON.parse(storedCards);
          if (Array.isArray(parsedCards)) {
            setCards(parsedCards);
          }
        } catch (e) {
          console.error("Failed to parse virtual cards from localStorage", e);
        }
      } else {
        setCards(initialVirtualCards);
      }
      
      const storedWallet = localStorage.getItem('wallet');
      if (storedWallet) {
        try {
            const parsedWallet = JSON.parse(storedWallet);
            setCurrentWallet(parsedWallet);
        } catch(e) {
            console.error("Failed to parse wallet from localStorage", e);
        }
      }

    };
    
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial check

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const primaryCard = cards.find((vc) => vc.isPrimary) || (cards.length > 0 ? cards[0] : null);


  const handleTransaction = (amount: number, type: 'send' | 'request' | 'pay' | 'add') => {
    const newBalance = type === 'add'
      ? currentWallet.balance + amount
      : currentWallet.balance - amount;
    
    const newWallet = { ...currentWallet, balance: newBalance };
    setWallet(newWallet);
    setCurrentWallet(newWallet);

    let title = '';
    let description = '';

    switch(type) {
        case 'add':
            title = 'Money Added!';
            description = 'Your balance has been updated.';
            break;
        case 'send':
            title = 'Money Sent!';
            description = `Successfully sent $${amount.toFixed(2)}.`;
            break;
        case 'pay':
            title = 'Payment Sent!';
            description = `Successfully paid $${amount.toFixed(2)}.`;
            break;
        case 'request':
            title = 'Request Sent!';
            description = `Your request for $${amount.toFixed(2)} has been sent.`;
            return; // Don't show toast for request
    }

    toast({ title, description });
  };

  if (!isClient) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
      
      <div className="grid gap-8 md:grid-cols-12">
        
        {/* Main Column */}
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
          
          {/* Wallet Card */}
          <Card>
            <CardHeader>
                <CardDescription>Available Balance</CardDescription>
                <CardTitle className="text-4xl tracking-tight">${currentWallet.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                />
                             <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                                />
                            <Bar
                                dataKey="total"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <QuickActionButton icon={ArrowUp} label="Send" onAction={() => handleTransaction(50, 'send')} />
             <QuickActionButton icon={UserPlus} label="Request" onAction={() => handleTransaction(20, 'request')} />
             <QuickActionButton icon={PlusCircle} label="Add Money" onAction={() => handleTransaction(100, 'add')} />
             <QuickActionButton icon={ScanLine} label="Scan & Pay" href="/dashboard/payments" />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest transactions.
                </CardDescription>
              </div>
              <Link href="/dashboard/transactions">
                 <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {transactions.slice(0, 4).map((transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage
                              src={transaction.avatar}
                              alt={transaction.name}
                              data-ai-hint="person face"
                            />
                            <AvatarFallback>
                              {transaction.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{transaction.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(transaction.date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                       <TableCell className="text-right">
                          <p className={`font-semibold ${transaction.type === 'sent' ? '' : 'text-green-600 dark:text-green-400'}`}>
                            {transaction.type === 'sent' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                          </p>
                       </TableCell>
                       <TableCell className="pl-0 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Repeat Transaction</DropdownMenuItem>
                                <DropdownMenuItem>Report an Issue</DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="md:col-span-5 lg:col-span-4 space-y-8">
           <Card>
                <CardHeader>
                    <CardTitle>My Card</CardTitle>
                </CardHeader>
                <CardContent>
                    {primaryCard ? (
                    <div onClick={() => setIsCardFlipped(f => !f)} className="cursor-pointer">
                        <AnimatedVirtualCard card={primaryCard} isVisible={isCardFlipped} />
                    </div>
                    ) : (
                    <Card className="h-56 flex items-center justify-center w-full bg-muted/50">
                        <div className="text-center text-muted-foreground">
                        <p>No primary card found.</p>
                        <Link href="/dashboard/cards">
                            <Button variant="link" className="mt-2">Create or set a primary card</Button>
                        </Link>
                        </div>
                    </Card>
                    )}
                </CardContent>
          </Card>
          
          <QrPaymentForm onPayment={(amount) => handleTransaction(amount, 'pay')} />
        </div>
      </div>
    </div>
  );
}
