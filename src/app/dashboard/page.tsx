
'use client';

import {
  ArrowDown,
  ArrowUp,
  Send,
  UserPlus,
  PlusCircle,
  ScanLine,
  ArrowRight,
  Landmark,
  Receipt,
  CreditCard,
  BrainCircuit,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { wallet, transactions, setWallet, type Wallet } from '@/lib/data';
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
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

function SendMoneyDialog({ onSend }: { onSend: (amount: number) => void }) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    const sendAmount = parseFloat(amount);
    if (isNaN(sendAmount) || sendAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to send.',
        variant: 'destructive',
      });
      return;
    }
    onSend(sendAmount);
    toast({
      title: 'Money Sent!',
      description: 'Your transaction has been processed successfully.',
    });
    setAmount('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 p-4 w-full transition-colors">
          <div className="p-3 bg-background rounded-full">
            <ArrowUp className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-medium">Send</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Enter the details of the recipient and the amount to send.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient-email">Recipient&apos;s Email</Label>
            <Input
              id="recipient-email"
              placeholder="name@example.com"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="send-amount">Amount (USD)</Label>
            <Input
              id="send-amount"
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Contacts</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {transactions.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  className="flex flex-col items-center gap-1.5 text-center w-20"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={t.avatar}
                      alt={t.name}
                      data-ai-hint="person face"
                    />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSend} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequestMoneyDialog({
  onRequest,
}: {
  onRequest: (amount: number) => void;
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleRequest = () => {
    const requestAmount = parseFloat(amount);
    if (isNaN(requestAmount) || requestAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to request.',
        variant: 'destructive',
      });
      return;
    }
    onRequest(requestAmount);
    toast({
      title: 'Request Sent!',
      description: 'Your request for has been sent.',
    });
    setAmount('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 p-4 w-full transition-colors">
          <div className="p-3 bg-background rounded-full">
            <ArrowDown className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-medium">Request</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Money</DialogTitle>
          <DialogDescription>
            Enter the details to request money from another user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="requester-email">Request from (Email)</Label>
            <Input
              id="requester-email"
              placeholder="name@example.com"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="request-amount">Amount (USD)</Label>
            <Input
              id="request-amount"
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Contacts</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {transactions.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  className="flex flex-col items-center gap-1.5 text-center w-20"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={t.avatar}
                      alt={t.name}
                      data-ai-hint="person face"
                    />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRequest} className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddMoneyDialog({
  onAdd,
}: {
  onAdd: (amount: number) => void;
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    const addAmount = parseFloat(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to add.',
        variant: 'destructive',
      });
      return;
    }
    onAdd(addAmount);
    toast({
      title: 'Money Added!',
      description: 'Your balance has been updated.',
    });
    setAmount('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 p-4 w-full transition-colors">
          <div className="p-3 bg-background rounded-full">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-medium">Add Money</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
          <DialogDescription>
            Select a source and amount to add to your balance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
           <div className="grid gap-2">
            <Label>From</Label>
             <div className="flex items-center gap-4 border p-3 rounded-lg bg-muted cursor-pointer hover:bg-muted/80">
                <Landmark className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Main Savings</p>
                  <p className="text-sm text-muted-foreground">
                    Capital Bank •••• 1234
                  </p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-amount">Amount (USD)</Label>
            <Input
              id="add-amount"
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Funds
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function DashboardPage() {
  const [user, setUser] = useState<User>(initialUser);
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [currentWallet, setCurrentWallet] = useState<Wallet>(wallet);
  const [isClient, setIsClient] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

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
    const newBalance = type === 'request' || type === 'add'
      ? currentWallet.balance + amount
      : currentWallet.balance - amount;
    
    const newWallet = { ...currentWallet, balance: newBalance };
    setWallet(newWallet);
    setCurrentWallet(newWallet);
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
          <Card className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="flex-1 w-full">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <div className="text-4xl font-bold tracking-tight">
                ${currentWallet.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
            </div>
             <div className="w-full md:w-auto md:min-w-[320px]">
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
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <SendMoneyDialog onSend={(amount) => handleTransaction(amount, 'send')} />
             <RequestMoneyDialog onRequest={(amount) => handleTransaction(amount, 'request')} />
             <AddMoneyDialog onAdd={(amount) => handleTransaction(amount, 'add')} />
             <Link href="/dashboard/payments" className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 p-4 w-full transition-colors">
                <div className="p-3 bg-background rounded-full">
                  <ScanLine className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Scan & Pay</span>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Here are the latest movements in your account.
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
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
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
                          <p className={cn("font-semibold", transaction.type === 'sent' ? '' : 'text-primary')}>
                            {transaction.type === 'sent' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                          </p>
                          <Badge variant="outline" className={cn(
                            'capitalize mt-1',
                            transaction.type === 'sent' ? 'border-destructive/50 text-destructive' :
                            transaction.type === 'received' ? 'border-primary/50 text-primary' : ''
                          )}>
                            {transaction.type}
                          </Badge>
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
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Your essential shortcuts.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/payments">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                        <Receipt className="h-6 w-6 text-primary" />
                        <span className="font-medium">Pay Bills</span>
                    </div>
                </Link>
                 <Link href="/dashboard/cards">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <span className="font-medium">My Cards</span>
                    </div>
                </Link>
                 <Link href="/dashboard/insights">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors col-span-2">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        <span className="font-medium">AI Spending Insights</span>
                    </div>
                </Link>
            </CardContent>
          </Card>
          
          <QrPaymentForm onPayment={(amount) => handleTransaction(amount, 'send')} />
        </div>
      </div>
    </div>
  );
}

    