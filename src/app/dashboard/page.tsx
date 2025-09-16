import { ArrowDown, ArrowUp, ArrowRightLeft, CreditCard } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

function VirtualCard({ card }: { card: typeof virtualCards[0] }) {
  return (
    <div className="relative w-full max-w-sm h-56 rounded-xl p-6 flex flex-col justify-between text-white bg-gradient-to-br from-primary via-purple-500 to-pink-400 shadow-lg">
      <div className="flex justify-between items-start">
        <span className="text-lg font-semibold">PeerPay</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 opacity-80"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-mono text-2xl tracking-widest">
          •••• •••• •••• {card.last4}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-80">Card Holder</p>
          <p className="font-medium">{card.cardholder}</p>
        </div>
        <div>
          <p className="text-xs opacity-80">Expires</p>
          <p className="font-medium">{card.expiry}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const primaryCard = virtualCards.find((vc) => vc.isPrimary);

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid gap-4 md:gap-8 xl:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Your Wallet</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              ${wallet.balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Available balance
            </p>
          </CardContent>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button size="lg">
                <ArrowUp className="mr-2 h-4 w-4" /> Send Money
              </Button>
              <Button size="lg" variant="secondary">
                <ArrowDown className="mr-2 h-4 w-4" /> Request
              </Button>
              <Button size="lg" variant="outline" className="col-span-2 md:col-span-1">
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>
        
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

      <div className="grid gap-4 md:gap-8">
        <QrPaymentForm />
        <Card>
          <CardHeader>
            <CardTitle>Virtual Card</CardTitle>
            <CardDescription>
              Your primary card for secure online payments.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            {primaryCard && <VirtualCard card={primaryCard} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
