'use client';

import { ArrowDown, ArrowUp, Send, UserPlus } from 'lucide-react';
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
import { wallet, transactions, virtualCards } from '@/lib/data';
import { QrPaymentForm } from '@/components/qr-payment-form';
import { AnimatedVirtualCard } from '@/components/animated-virtual-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
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

function SendMoneyDialog() {
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="w-full">
          <ArrowUp className="mr-2 h-4 w-4" /> Send
        </Button>
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
            <Input id="send-amount" placeholder="0.00" type="number" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Contacts</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {transactions.slice(0, 4).map(t => (
                    <button key={t.id} className="flex flex-col items-center gap-1.5 text-center w-20">
                         <Avatar className="h-12 w-12">
                            <AvatarImage src={t.avatar} alt={t.name} data-ai-hint="person face" />
                            <AvatarFallback>{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate w-full">{t.name}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              toast({
                title: 'Money Sent!',
                description: 'Your transaction has been processed successfully.',
              });
            }}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequestMoneyDialog() {
    const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="w-full">
          <ArrowDown className="mr-2 h-4 w-4" /> Request
        </Button>
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
            <Input id="request-amount" placeholder="0.00" type="number" />
          </div>
           <div>
            <h4 className="text-sm font-medium mb-2">Recent Contacts</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {transactions.slice(0, 4).map(t => (
                    <button key={t.id} className="flex flex-col items-center gap-1.5 text-center w-20">
                         <Avatar className="h-12 w-12">
                            <AvatarImage src={t.avatar} alt={t.name} data-ai-hint="person face" />
                            <AvatarFallback>{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate w-full">{t.name}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              toast({
                title: 'Request Sent!',
                description: 'Your request has been sent successfully.',
              });
            }}
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function DashboardPage() {
  const primaryCard = virtualCards.find((vc) => vc.isPrimary);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
          <Card className="bg-primary text-primary-foreground overflow-hidden shadow-xl">
             <CardContent className="p-8">
                <p className="text-sm text-primary-foreground/80">
                  Available Balance
                </p>
                <div className="text-5xl font-bold tracking-tight">
                  ${wallet.balance.toLocaleString()}
                </div>
              </CardContent>
          </Card>
           <div className="grid grid-cols-2 gap-4">
              <SendMoneyDialog />
              <RequestMoneyDialog />
            </div>
        </div>
        <div className="md:col-span-5 lg:col-span-4 row-start-1 md:row-start-auto">
            {primaryCard && <AnimatedVirtualCard card={primaryCard} />}
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
         <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Here are the latest movements in your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={transaction.avatar}
                                alt={transaction.name}
                                data-ai-hint="person face"
                              />
                              <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{transaction.name}</p>
                              <p className="text-sm text-muted-foreground hidden sm:block">{transaction.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            transaction.type === 'sent'
                              ? 'text-destructive'
                              : 'text-primary'
                          }`}
                        >
                          {transaction.type === 'sent' ? '-' : '+'} $
                          {transaction.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
         </div>
         <div className="space-y-8">
            <QrPaymentForm />
         </div>
      </div>
    </div>
  );
}
