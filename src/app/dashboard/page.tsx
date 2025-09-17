
'use client';

import {
  ArrowUp,
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
import { DashboardNav } from '@/components/dashboard-nav';


function AddMoneyDialog({ onAddMoney }: { onAddMoney: (amount: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<LinkedAccount | null>(null);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
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
        <div className="w-full cursor-pointer">
          <QuickActionButton icon={PlusCircle} label="Add Money" />
        </div>
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


function SendMoneyDialog({ onSend }: { onSend: (amount: number, recipient: string) => void }) {
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
    onSend(sendAmount, recipient);
    setIsOpen(false);
    setRecipient('');
    setAmount('');
    setNote('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full cursor-pointer">
            <QuickActionButton icon={ArrowUp} label="Send" />
        </div>
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
              placeholder="Email or Account No."
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

function RequestMoneyDialog({ onRequest }: { onRequest: (amount: number, recipient: string) => void }) {
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
    onRequest(requestAmount, recipient);
    setIsOpen(false);
    setRecipient('');
    setAmount('');
    setNote('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full cursor-pointer">
          <QuickActionButton icon={UserPlus} label="Request" />
        </div>
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
              placeholder="Email or Account No."
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


function QuickActionButton({ icon: Icon, label, href, onClick }: { icon: React.ElementType, label: string, href?: string, onClick?: () => void }) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 p-4 w-full transition-colors h-full">
            <div className="p-3 bg-background rounded-full shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
    )

    if (href) {
        return <Link href={href} className="w-full">{content}</Link>
    }
    
    return <div className="w-full" onClick={onClick}>{content}</div>
}

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

  const handleTransaction = (amount: number, type: 'send' | 'request' | 'pay' | 'add', recipient?: string) => {
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
            description = `Successfully sent $${amount.toFixed(2)} to ${recipient}.`;
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
            description = `Your request for $${amount.toFixed(2)} to ${recipient} has been sent.`;
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
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
      
      <div className="grid gap-4 md:grid-cols-1">
        
        {/* Main Column */}
        <div className="space-y-4">
          
          {/* Combined Wallet and Card */}
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="p-6 flex flex-col justify-center">
                    <CardDescription>Available Balance</CardDescription>
                    <CardTitle className="text-4xl tracking-tight">${currentWallet.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-2">+20.1% from last month</p>
                </div>
                 <div className="p-6 bg-muted/50 flex items-center justify-center min-h-[220px]">
                     {primaryCard ? (
                        <div onClick={() => setIsCardFlipped(f => !f)} className="cursor-pointer w-full flex justify-center">
                            <AnimatedVirtualCard card={primaryCard} isVisible={isCardFlipped} />
                        </div>
                        ) : (
                        <Card className="h-48 flex items-center justify-center w-full max-w-[320px] bg-muted">
                            <div className="text-center text-muted-foreground">
                            <p>No primary card found.</p>
                            <Link href="/dashboard/cards">
                                <Button variant="link" className="mt-2">Create or set a primary card</Button>
                            </Link>
                            </div>
                        </Card>
                    )}
                 </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <SendMoneyDialog onSend={(amount, recipient) => handleTransaction(amount, 'send', recipient)} />
             <RequestMoneyDialog onRequest={(amount, recipient) => handleTransaction(amount, 'request', recipient)} />
             <AddMoneyDialog onAddMoney={(amount) => handleTransaction(amount, 'add')} />
             <Dialog open={isQrPaymentOpen} onOpenChange={setIsQrPaymentOpen}>
                <DialogTrigger asChild>
                    <div className="w-full cursor-pointer">
                        <QuickActionButton icon={ScanLine} label="Scan & Pay" />
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                     <QrPaymentForm onPayment={(amount) => {
                        handleTransaction(amount, 'pay');
                        setIsQrPaymentOpen(false);
                     }} />
                </DialogContent>
             </Dialog>
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
                            <p className="text-sm text-muted-foreground md:hidden">
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
      </div>
    </div>
  );
}
