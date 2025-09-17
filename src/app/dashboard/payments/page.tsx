
'use client'


import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { setWallet, wallet as initialWallet, type Wallet } from '@/lib/data';
import { Lightbulb, Droplets, Wifi, Smartphone, Flame, Youtube, Sprout, QrCode } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { QrPaymentForm } from '@/components/qr-payment-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function UtilityPayments({onPay}: {onPay: (amount: number) => void}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    const paymentAmount = parseFloat(amount);
     if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to pay.',
        variant: 'destructive',
      });
      return;
    }
    onPay(paymentAmount);
    toast({ 
      title: 'Payment Submitted', 
      description: `Your bill payment of $${paymentAmount} is being processed. You've earned ${Math.floor(paymentAmount / 10)} points!`
    });
    setAmount('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Utility Bill</CardTitle>
        <CardDescription>
          Select a biller and enter your account details to proceed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="biller">Select Biller</Label>
          <Select>
            <SelectTrigger id="biller">
              <SelectValue placeholder="Choose a utility provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Electricity Board
                </div>
              </SelectItem>
              <SelectItem value="water">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" /> Water Supply Corp.
                </div>
              </SelectItem>
              <SelectItem value="internet">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" /> Internet Provider
                </div>
              </SelectItem>
              <SelectItem value="gas">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4" /> Gas Company
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <Input id="account-number" placeholder="Enter your account number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePay} className="w-full">Pay Bill</Button>
      </CardFooter>
    </Card>
  );
}

function MobileTopUp({onTopUp}: {onTopUp: (amount: number) => void}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const quickAmounts = [10, 20, 50, 100];

  const handleTopUp = (topUpAmount: number) => {
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter or select a valid amount.',
        variant: 'destructive',
      });
      return;
    }
    onTopUp(topUpAmount);
    toast({ 
      title: 'Top-up Successful', 
      description: `The mobile top-up of $${topUpAmount} has been completed.`
    });
    setAmount('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile Recharge</CardTitle>
        <CardDescription>
          Enter a mobile number and select an amount to recharge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mobile-number">Mobile Number</Label>
          <div className="flex items-center gap-2">
            <div className="w-20">
              <Input readOnly value="+1" />
            </div>
            <Input id="mobile-number" type="tel" placeholder="555-123-4567" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="top-up-amount">Amount (USD)</Label>
          <Input id="top-up-amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Or select a quick amount</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button key={quickAmount} variant="outline" onClick={() => handleTopUp(quickAmount)}>
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleTopUp(parseFloat(amount))} className="w-full">
          <Smartphone className="mr-2 h-4 w-4" />
          Recharge Now
        </Button>
      </CardFooter>
    </Card>
  );
}

function SubscriptionPayments({onPay}: {onPay: (amount: number) => void}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('');

  const subscriptionDetails: Record<string, { icon: React.ElementType, defaultAmount: string }> = {
    netflix: { icon: () => <Sprout className="h-4 w-4 text-red-600" />, defaultAmount: '15.49' },
    spotify: { icon: () => <Sprout className="h-4 w-4 text-green-500" />, defaultAmount: '10.99' },
    youtube: { icon: Youtube, defaultAmount: '13.99' }
  }

  useEffect(() => {
    if(service && subscriptionDetails[service]) {
      setAmount(subscriptionDetails[service].defaultAmount);
    } else {
      setAmount('');
    }
  }, [service, subscriptionDetails]);


  const handlePay = () => {
    const paymentAmount = parseFloat(amount);
     if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to pay.',
        variant: 'destructive',
      });
      return;
    }
    if (!service) {
      toast({
        title: 'No Service Selected',
        description: 'Please choose a subscription service.',
        variant: 'destructive',
      });
      return;
    }
    onPay(paymentAmount);
    toast({ 
      title: 'Payment Successful', 
      description: `Your subscription payment of $${paymentAmount} for ${service.charAt(0).toUpperCase() + service.slice(1)} has been processed.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay for Subscriptions</CardTitle>
        <CardDescription>
          Manage your recurring subscription payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service">Select Service</Label>
          <Select onValueChange={setService} value={service}>
            <SelectTrigger id="service">
              <SelectValue placeholder="Choose a subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="netflix">
                <div className="flex items-center gap-2">
                  {React.createElement(subscriptionDetails.netflix.icon)} Netflix
                </div>
              </SelectItem>
              <SelectItem value="spotify">
                <div className="flex items-center gap-2">
                  {React.createElement(subscriptionDetails.spotify.icon)} Spotify
                </div>
              </SelectItem>
              <SelectItem value="youtube">
                <div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" /> YouTube Premium
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-amount">Amount (USD)</Label>
          <Input id="sub-amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePay} className="w-full" disabled={!service}>Pay Subscription</Button>
      </CardFooter>
    </Card>
  );
}

export default function PaymentsPage() {
  const [currentWallet, setCurrentWallet] = useState<Wallet>(initialWallet);
  const [isQrPaymentOpen, setIsQrPaymentOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedWallet = localStorage.getItem('wallet');
      if (storedWallet) {
        try {
          const parsedWallet = JSON.parse(storedWallet);
          setCurrentWallet(parsedWallet);
        } catch (e) {
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

  const handlePayment = (amount: number, type: 'bill' | 'topup' | 'subscription' | 'qr') => {
    const pointsEarned = type === 'bill' ? Math.floor(amount / 10) : 0;
    const newWallet: Wallet = {
      ...currentWallet,
      balance: currentWallet.balance - amount,
      rewardsPoints: currentWallet.rewardsPoints + pointsEarned,
    };
    setWallet(newWallet);
    setCurrentWallet(newWallet);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your bills, mobile recharges, and subscriptions with ease.
          </p>
        </div>
        <Dialog open={isQrPaymentOpen} onOpenChange={setIsQrPaymentOpen}>
          <DialogTrigger asChild>
            <Button>
              <QrCode className="mr-2 h-4 w-4" /> Scan &amp; Pay
            </Button>
          </DialogTrigger>
          <DialogContent>
            <QrPaymentForm onPayment={(amount) => {
              handlePayment(amount, 'qr');
              setIsQrPaymentOpen(false);
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <UtilityPayments onPay={(amount) => handlePayment(amount, 'bill')} />
          <SubscriptionPayments onPay={(amount) => handlePayment(amount, 'subscription')} />
        </div>
        <div className="space-y-8">
          <MobileTopUp onTopUp={(amount) => handlePayment(amount, 'topup')} />
        </div>
      </div>
    </div>
  );
}

    