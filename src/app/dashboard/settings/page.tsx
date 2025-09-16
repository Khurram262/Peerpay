
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
import { Landmark, CreditCard, PlusCircle } from 'lucide-react';
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
import { initialLinkedAccounts, type LinkedAccount } from '@/lib/data';

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

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedAccounts = localStorage.getItem('linkedAccounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    } else {
      setAccounts(initialLinkedAccounts);
    }
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
      type: 'bank',
      ...newAccountDetails,
    };
    updateAccounts([...accounts, newAccount]);
    toast({
      title: 'Account Linked',
      description: 'Your new bank account has been successfully linked.',
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

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Alex Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="alex.doe@example.com" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
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
              className="border p-4 rounded-lg flex justify-between items-center"
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAccount(account.id)}
              >
                Remove
              </Button>
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
