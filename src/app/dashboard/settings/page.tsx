
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Landmark, CreditCard, PlusCircle, ArrowDownToLine, ArrowUpFromLine, ShieldCheck } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { initialLinkedAccounts, type LinkedAccount, user, wallet as initialWallet, setWallet, type Wallet } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import VerificationPage from '../verification/page';


function LinkAccountDialog({
  onLinkAccount,
}: {
  onLinkAccount: (account: Omit<LinkedAccount, 'id' | 'type'>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const { toast } = useToast();

  const handleLink = () => {
    if (!accountName || !bankName || !accountNumber) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to link an account.',
        variant: 'destructive',
      });
      return;
    }
    onLinkAccount({
      name: accountName,
      provider: bankName,
      last4: accountNumber.slice(-4),
    });
    setIsOpen(false);
    setAccountName('');
    setBankName('');
    setAccountNumber('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Link New Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link a New Account</DialogTitle>
          <DialogDescription>
            Enter the details of the bank account you want to link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="account-name">Account Nickname</Label>
            <Input
              id="account-name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., My Savings"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g., Capital Bank"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter full account number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLink}>Link Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddWithdrawMoneyDialog({
  account,
  mode,
  onTransaction,
}: {
  account: LinkedAccount;
  mode: 'add' | 'withdraw';
  onTransaction: (amount: number, mode: 'add' | 'withdraw') => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const title = mode === 'add' ? 'Add Money to PeerPay' : 'Withdraw Money from PeerPay';
  const description = mode === 'add'
    ? `Transfer funds from your ${account.name} account.`
    : `Transfer funds to your ${account.name} account.`;
  
  const handleConfirm = () => {
    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive amount.',
        variant: 'destructive',
      });
      return;
    }
    onTransaction(transactionAmount, mode);
    setIsOpen(false);
    setAmount('');
  };

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {mode === 'add' ? (
            <ArrowDownToLine className="mr-2 h-4 w-4" />
          ) : (
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
          )}
          {mode === 'add' ? 'Add Money' : 'Withdraw'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid gap-2">
            <Label>Account</Label>
            <div className="flex items-center gap-4 border p-3 rounded-lg bg-muted">
               {account.type === 'bank' ? (
                  <Landmark className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                )}
                <div>
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.provider} •••• {account.last4}
                  </p>
                </div>
            </div>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [currentWallet, setCurrentWallet] = useState<Wallet>(initialWallet);
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');


  useEffect(() => {
    const handleStorageChange = () => {
      const storedAccounts = localStorage.getItem('linkedAccounts');
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      } else {
        setAccounts(initialLinkedAccounts);
      }

      const storedWallet = localStorage.getItem('wallet');
      if(storedWallet) {
        setCurrentWallet(JSON.parse(storedWallet));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial check

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateAccounts = (newAccounts: LinkedAccount[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('linkedAccounts', JSON.stringify(newAccounts));
  };

  const handleLinkAccount = (
    newAccountDetails: Omit<LinkedAccount, 'id' | 'type'>
  ) => {
    const newAccount: LinkedAccount = {
      id: `acc_${Date.now()}`,
      type: Math.random() > 0.5 ? 'bank' : 'card', // Randomly assign for demo
      ...newAccountDetails,
    };
    updateAccounts([...accounts, newAccount]);
    toast({
      title: 'Account Linked',
      description: 'Your new account has been successfully linked.',
    });
  };

  const handleRemoveAccount = (accountId: string) => {
    updateAccounts(accounts.filter((acc) => acc.id !== accountId));
    toast({
      title: 'Account Removed',
      description: 'The linked account has been removed.',
      variant: 'destructive',
    });
  };

  const handleFundTransaction = (amount: number, mode: 'add' | 'withdraw') => {
    const newBalance = mode === 'add' 
      ? currentWallet.balance + amount
      : currentWallet.balance - amount;

    if (mode === 'withdraw' && newBalance < 0) {
      toast({
        title: 'Insufficient Funds',
        description: 'You do not have enough balance to withdraw this amount.',
        variant: 'destructive',
      });
      return;
    }
    
    const newWallet = { ...currentWallet, balance: newBalance };
    setWallet(newWallet);
    setCurrentWallet(newWallet);

    toast({
      title: `Transaction Successful`,
      description: mode === 'add'
        ? `$${amount.toFixed(2)} has been added to your PeerPay wallet.`
        : `$${amount.toFixed(2)} has been withdrawn to your account.`
    });
  };

  return (
    <div className="grid gap-8">
       <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information and account verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              {userAvatar && (
                <AvatarImage src={userAvatar.imageUrl} alt={user.name} />
              )}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='space-y-2'>
              <Label>Profile Picture</Label>
              <Input type="file" className="max-w-xs" />
              <p className="text-xs text-muted-foreground">
                Upload a new photo for your profile.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
      
      <VerificationPage />

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Enhance your account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="2fa" className="text-base">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Switch id="2fa" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label className="text-base">Change Password</Label>
              <p className="text-sm text-muted-foreground">
                It&apos;s a good idea to use a strong password that you&apos;re not
                using elsewhere.
              </p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>
                Manage your connected bank accounts and cards for funding and
                withdrawals.
              </CardDescription>
            </div>
            <LinkAccountDialog onLinkAccount={handleLinkAccount} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                {account.type === 'bank' ? (
                  <Landmark className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                )}
                <div>
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.provider} •••• {account.last4}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                 <AddWithdrawMoneyDialog account={account} mode="add" onTransaction={handleFundTransaction} />
                 <AddWithdrawMoneyDialog account={account} mode="withdraw" onTransaction={handleFundTransaction} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAccount(account.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
                <p>You have no linked accounts.</p>
                <p className="text-sm">Link one to get started!</p>
            </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
