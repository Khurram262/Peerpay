

'use client';

import {
  UserPlus,
  PlusCircle,
  ScanLine,
  ArrowRight,
  MoreHorizontal,
  CreditCard,
  History,
  Send,
  Landmark,
  ArrowDownToLine,
  Receipt,
  Gift,
  BrainCircuit,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { wallet, transactions, setWallet, type Wallet, type LinkedAccount, initialLinkedAccounts } from '@/lib/data';
import { QrPaymentForm } from '@/components/qr-payment-form';
import { AnimatedVirtualCard } from '@/components/animated-virtual-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initialVirtualCards } from '@/lib/data';
import type { VirtualCard, User } from '@/lib/data';
import Link from 'next/link';
import { user as initialUser } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';


function AddMoneyDialog({ children, onAddMoney }: { children: React.ReactNode, onAddMoney: (amount: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<LinkedAccount | null>(null);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const storedAccounts = localStorage.getItem('linkedAccounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    } else {
      setAccounts(initialLinkedAccounts);
    }
  }, [isOpen]);

  const handleAdd = () => {
    const addAmount = parseFloat(amount);
    if (!selectedAccount) {
      toast({ title: 'No Account Selected', description: 'Please select a funding source.', variant: 'destructive' });
      return;
    }
    if (!addAmount || addAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    onAddMoney(addAmount);
    setIsOpen(false);
    setSelectedAccount(null);
    setAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogDescription>Select a linked account and enter the amount to add.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label>From</Label>
            <div className="space-y-2">
              {accounts.length > 0 ? accounts.map(account => (
                <div key={account.id} onClick={() => setSelectedAccount(account)} className={`flex items-center gap-4 border p-3 rounded-lg cursor-pointer transition-colors ${selectedAccount?.id === account.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}>
                  {account.type === 'bank' ? <Landmark className="h-6 w-6 text-muted-foreground" /> : <CreditCard className="h-6 w-6 text-muted-foreground" />}
                  <div>
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{account.provider} •••• {account.last4}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg p-4">
                  <p>No linked accounts found.</p>
                  <Link href="/dashboard/settings">
                    <Button variant="link">Link an account</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {selectedAccount && (
            <div className="grid gap-2">
              <Label htmlFor="add-amount">Amount (USD)</Label>
              <Input id="add-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!selectedAccount || accounts.length === 0}>
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Add Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function SendMoneyDialog({ children, onSend }: { children: React.ReactNode, onSend: (amount: number, recipient: string, note: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleSend = () => {
    const sendAmount = parseFloat(amount);
    if (!recipient || !sendAmount || sendAmount <= 0) {
      toast({
        title: 'Invalid Details',
        description: 'Please enter a valid recipient and amount.',
        variant: 'destructive',
      });
      return;
    }
    onSend(sendAmount, recipient, note);
    setIsOpen(false);
    setRecipient('');
    setAmount('');
    setNote('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Enter the recipient's details and the amount to send.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Email, phone, or bank account"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., For dinner last night"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Send Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequestMoneyDialog({ children, onRequest }: { children: React.ReactNode, onRequest: (amount: number, recipient: string, note: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleRequest = () => {
    const requestAmount = parseFloat(amount);
    if (!recipient || !requestAmount || requestAmount <= 0) {
      toast({
        title: 'Invalid Details',
        description: 'Please enter a valid recipient and amount.',
        variant: 'destructive',
      });
      return;
    }
    onRequest(requestAmount, recipient, note);
    setIsOpen(false);
    setRecipient('');
    setAmount('');
    setNote('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Money</DialogTitle>
          <DialogDescription>
            Enter the contact's details and the amount to request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="request-recipient">From</Label>
            <Input
              id="request-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Email, phone, or account no."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="request-amount">Amount (USD)</Label>
            <Input
              id="request-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="request-note">Note (Optional)</Label>
            <Textarea
              id="request-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., For our upcoming trip"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRequest}>
            <UserPlus className="mr-2 h-4 w-4" />
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function ActionButton({ icon: Icon, label, href, onClick, className }: { icon: React.ElementType, label: string, href?: string, onClick?: () => void, className?: string }) {
    const content = (
         <div className={cn(
            "group relative flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-card text-card-foreground p-4 text-center transition-all duration-200 ease-in-out hover:scale-105 active:scale-95",
            "hover:bg-primary/5 dark:hover:bg-primary/10",
            className
          )}>
            <div className="rounded-full bg-muted p-4 transition-colors group-hover:bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
    );

    const Wrapper = onClick ? 'div' : Link;
    const props = onClick ? { onClick } : { href: href || '#' };

    return <Wrapper {...props} className="cursor-pointer">{content}</Wrapper>;
}

const transactionIcons = {
  sent: ArrowUpRight,
  received: ArrowDownLeft,
  'top-up': PlusCircle,
};

export default function DashboardPage() {
  const [user, setUser] = useState<User>(initialUser);
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [currentWallet, setCurrentWallet] = useState<Wallet>(wallet);
  const [isClient, setIsClient] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isQrPaymentOpen, setIsQrPaymentOpen] = useState(false);
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

  const handleTransaction = (amount: number, type: 'send' | 'request' | 'pay' | 'add', recipient?: string, note?: string) => {
    let newBalance: number;
    let title = '';
    let description = '';

    switch(type) {
        case 'add':
            newBalance = currentWallet.balance + amount;
            title = 'Money Added!';
            description = `Your balance has been updated. New balance: $${newBalance.toFixed(2)}`;
            break;
        case 'send':
            if (currentWallet.balance < amount) {
                toast({ title: 'Insufficient Funds', description: 'You do not have enough money to complete this transaction.', variant: 'destructive' });
                return;
            }
            newBalance = currentWallet.balance - amount;
            title = 'Money Sent!';
            description = `Successfully sent $${amount.toFixed(2)} to ${recipient}. ${note ? `Note: ${note}`: ''}`;
            break;
        case 'pay':
             if (currentWallet.balance < amount) {
                toast({ title: 'Insufficient Funds', description: 'You do not have enough money to complete this payment.', variant: 'destructive' });
                return;
            }
            newBalance = currentWallet.balance - amount;
            title = 'Payment Sent!';
            description = `Successfully paid $${amount.toFixed(2)}.`;
            break;
        case 'request':
            title = 'Request Sent!';
            description = `Your request for $${amount.toFixed(2)} to ${recipient} has been sent. ${note ? `Note: ${note}`: ''}`;
            toast({ title, description });
            return; // No balance change for requests
        default:
            return;
    }
    
    const newWallet = { ...currentWallet, balance: newBalance };
    setWallet(newWallet);
    setCurrentWallet(newWallet);

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
    <div className="flex flex-col gap-4">
      <div className="block md:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-4xl">
              ${currentWallet.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Primary Card</CardTitle>
            </CardHeader>
            <CardContent>
                 {primaryCard ? (
                    <div onClick={() => setIsCardFlipped(f => !f)} className="cursor-pointer">
                        <AnimatedVirtualCard card={primaryCard} isVisible={isCardFlipped} />
                    </div>
                    ) : (
                    <div className="text-center text-muted-foreground">
                        <p>No primary card found.</p>
                        <Link href="/dashboard/cards">
                            <Button variant="link" className="mt-2">Create or set a primary card</Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <div className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <SendMoneyDialog onSend={(amount, recipient, note) => handleTransaction(amount, 'send', recipient, note)}>
                    <ActionButton icon={Send} label="Send" />
                </SendMoneyDialog>
                <RequestMoneyDialog onRequest={(amount, recipient, note) => handleTransaction(amount, 'request', recipient, note)}>
                    <ActionButton icon={UserPlus} label="Request" />
                </RequestMoneyDialog>
                 <AddMoneyDialog onAddMoney={(amount) => handleTransaction(amount, 'add')}>
                    <ActionButton icon={PlusCircle} label="Add Money" />
                 </AddMoneyDialog>
                 <Dialog open={isQrPaymentOpen} onOpenChange={setIsQrPaymentOpen}>
                    <DialogTrigger asChild>
                         <ActionButton icon={ScanLine} label="Scan & Pay" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Scan & Pay</DialogTitle>
                            <DialogDescription>
                            Pay instantly by uploading or scanning a QR code.
                            </DialogDescription>
                        </DialogHeader>
                        <QrPaymentForm onPayment={(amount) => {
                            handleTransaction(amount, 'pay');
                            setIsQrPaymentOpen(false);
                        }} />
                    </DialogContent>
                </Dialog>
                <ActionButton icon={Receipt} label="Payments" href="/dashboard/payments" />
                <ActionButton icon={Gift} label="Rewards" href="/dashboard/rewards" />
                <ActionButton icon={BrainCircuit} label="Insights" href="/dashboard/insights" />
              </div>
            </CardContent>
          </Card>

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
              <div className="space-y-1">
                {transactions.slice(0, 4).map((transaction) => {
                  const Icon = transactionIcons[transaction.type];
                  const color =
                    transaction.type === 'sent'
                      ? 'text-red-500 dark:text-red-400'
                      : transaction.type === 'received'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground';

                  return (
                    <Card key={transaction.id} className="p-4 shadow-none border-0 border-b last:border-b-0 rounded-none">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn('p-2 rounded-full bg-muted', color)}>
                            <Icon className="h-5 w-5 bg-transparent text-current" />
                          </div>
                          <div>
                            <p className="font-bold">{transaction.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(transaction.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className={cn('font-semibold', color)}>
                            {transaction.type === 'sent' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                          </p>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 relative -right-2">
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Repeat Transaction</DropdownMenuItem>
                                  <DropdownMenuItem>Report an Issue</DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
