
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
import { wallet as initialWallet, type Wallet, rewardHistory, type Reward, user } from '@/lib/data';
import { Gift, Star, Copy, Share2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

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

  return (
    <div className="grid gap-8">
      <Card className="bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Gift className="h-10 w-10" />
            <div>
              <CardDescription className="text-yellow-200">
                Your Rewards Points
              </CardDescription>
              <CardTitle className="text-4xl font-bold">
                {currentWallet.rewardsPoints.toLocaleString()}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-100">
            Earn points on bill payments, referrals and more. Redeem them for exciting rewards!
          </p>
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
