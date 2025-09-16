'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function DashboardPage() {
  const primaryCard = virtualCards.find((vc) => vc.isPrimary);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
          <Card className="bg-primary text-primary-foreground overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
               <CardContent className="p-8 flex flex-col justify-center">
                <p className="text-sm text-primary-foreground/80">
                  Available Balance
                </p>
                <div className="text-5xl font-bold tracking-tight">
                  ${wallet.balance.toLocaleString()}
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-primary/80 flex items-center justify-center">
                 <div className="grid grid-cols-2 gap-4 w-full">
                  <Button size="lg" variant="secondary" className="w-full">
                    <ArrowUp className="mr-2 h-4 w-4" /> Send
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full">
                    <ArrowDown className="mr-2 h-4 w-4" /> Request
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
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
                              : 'text-green-600'
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
