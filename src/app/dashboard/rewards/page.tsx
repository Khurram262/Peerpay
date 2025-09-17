
'use client';

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
import { wallet as initialWallet, type Wallet, rewardHistory, type Reward, user, setWallet, vouchers, type Voucher } from '@/lib/data';
import { Gift, Star, Copy, Share2, Ticket, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function RewardsPage() {
  const [currentWallet, setCurrentWallet] = useState<Wallet>(initialWallet);
  const { toast } = useToast();

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
  
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({
        title: 'Referral Code Copied!',
        description: 'You can now share your referral code with friends.',
    });
  }

  const handleRedeemVoucher = (voucher: Voucher) => {
    if (currentWallet.rewardsPoints < voucher.points) {
      toast({
        title: 'Not Enough Points',
        description: `You need ${voucher.points} points to redeem this voucher.`,
        variant: 'destructive',
      });
      return;
    }
    const newWallet = {
      ...currentWallet,
      rewardsPoints: currentWallet.rewardsPoints - voucher.points,
    };
    setWallet(newWallet);
    setCurrentWallet(newWallet);
    toast({
        title: 'Voucher Redeemed!',
        description: `You have successfully redeemed "${voucher.title}". Your code is ${voucher.code}.`,
        duration: 9000,
        action: (
            <Button size="sm" onClick={() => navigator.clipboard.writeText(voucher.code)}>
                <Copy className="mr-2 h-4 w-4" /> Copy Code
            </Button>
        )
    })
  };

  return (
    <div className="grid gap-8">
      <Card className="bg-gradient-to-tr from-primary/80 to-primary text-primary-foreground shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Gift className="h-10 w-10" />
            <div>
              <CardDescription className="text-primary-foreground/80">
                Your Rewards Points
              </CardDescription>
              <CardTitle className="text-4xl font-bold">
                {currentWallet.rewardsPoints.toLocaleString()}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-primary-foreground/90">
            Earn points on bill payments, referrals and more. Redeem them for exciting rewards!
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Redeem Rewards</CardTitle>
            <CardDescription>Use your points to get exclusive vouchers and discounts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers.map(voucher => (
                <Card key={voucher.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">{voucher.title}</CardTitle>
                                <CardDescription>{voucher.description}</CardDescription>
                            </div>
                            <div className="p-2 bg-muted rounded-full">
                                <Ticket className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-2xl font-bold text-primary flex items-center gap-2">
                           <Star className="h-6 w-6 text-amber-400 fill-amber-400" /> {voucher.points.toLocaleString()} Points
                        </p>
                    </CardContent>
                    <CardFooter>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full" disabled={currentWallet.rewardsPoints < voucher.points}>Redeem Now</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Redemption</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to redeem "{voucher.title}" for {voucher.points} points? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRedeemVoucher(voucher)}>
                                        Confirm
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            ))}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Invite Friends, Earn Rewards</CardTitle>
          <CardDescription>Share your referral code. You and your friend will both get 200 bonus points when they sign up!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input readOnly value={user.referralCode} className="text-lg h-12 text-center sm:text-left" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyReferral} className="w-full">
                <Copy className="mr-2" /> Copy Code
              </Button>
               <Button variant="outline" className="w-full">
                <Share2 className="mr-2" /> Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>
            A log of your recent points activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewardHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                         <Star className="h-5 w-5 text-amber-500" />
                      </div>
                      <span className='font-medium'>{item.activity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(parseISO(item.date), 'MMMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    + {item.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
