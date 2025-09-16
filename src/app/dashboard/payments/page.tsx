

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Droplets, Wifi, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


function UtilityPayments() {
  const { toast } = useToast();
  const router = useRouter();
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
    
    localStorage.setItem('paymentAmount', paymentAmount.toString());

    toast({ 
      title: 'Payment Submitted', 
      description: 'Your utility bill payment is being processed.'
    });

    router.push('/dashboard');
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

function MobileTopUp() {
  const { toast } = useToast();
  const router = useRouter();
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
    
    localStorage.setItem('paymentAmount', topUpAmount.toString());

    toast({ 
      title: 'Top-up Successful', 
      description: 'The mobile top-up has been completed.'
    });
    router.push('/dashboard');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile Top-up</CardTitle>
        <CardDescription>
          Enter a mobile number and select an amount to top-up.
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
          <div className="grid grid-cols-4 gap-2">
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
          Top-up Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PaymentsPage() {

  React.useEffect(() => {
    localStorage.removeItem('paymentAmount');
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage your bills and top-ups with ease.
        </p>
      </div>

      <Tabs defaultValue="utility" className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="utility">Utility Bills</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Top-up</TabsTrigger>
        </TabsList>
        <TabsContent value="utility">
          <UtilityPayments />
        </TabsContent>
        <TabsContent value="mobile">
          <MobileTopUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
