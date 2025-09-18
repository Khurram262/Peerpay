
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
import { Landmark, CreditCard, PlusCircle, ArrowDownToLine, ArrowUpFromLine, Fingerprint, Languages, DollarSign, Edit } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';


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

  return (
    <div className="grid gap-8">
       <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              {userAvatar && (
                <AvatarImage src={userAvatar.imageUrl} alt={user.name} />
              )}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='space-y-2 flex-grow'>
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
              <Label htmlFor="2fa" className="text-base font-medium flex items-center gap-2">
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
              <Label htmlFor="biometric" className="text-base font-medium flex items-center gap-2">
                <Fingerprint /> Biometric Login
              </Label>
              <p className="text-sm text-muted-foreground">
                Use your face or fingerprint to log in.
              </p>
            </div>
            <Switch id="biometric" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label className="text-base font-medium">Change Password</Label>
              <p className="text-sm text-muted-foreground">
                It&apos;s a good idea to use a strong password.
              </p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Manage transaction limits and funding sources.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Transaction Limits</Label>
            <p className="text-sm text-muted-foreground mb-4">Your current limits per transaction.</p>
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                        <span>Send Money</span>
                        <span className="font-semibold">$5,000.00</span>
                    </div>
                    <Progress value={50} />
                </div>
                <div className="space-y-1">
                     <div className="flex justify-between items-center text-sm">
                        <span>Withdraw</span>
                        <span className="font-semibold">$2,000.00</span>
                    </div>
                    <Progress value={20} />
                </div>
                 <div className="flex justify-end">
                    <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Request Limit Increase</Button>
                </div>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                    <Label className="text-base font-medium">Linked Accounts</Label>
                    <p className="text-sm text-muted-foreground">Manage your funding sources.</p>
                </div>
                <LinkAccountDialog onLinkAccount={handleLinkAccount} />
            </div>
            <div className="grid gap-4">
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
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>You have no linked accounts.</p>
                    <p className="text-sm">Link one to get started!</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your app experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <Label htmlFor="language" className="text-base font-medium flex items-center gap-2">
                    <Languages /> Language
                </Label>
                <p className="text-sm text-muted-foreground">
                    Choose your preferred language.
                </p>
            </div>
            <Select defaultValue="en-us">
                <SelectTrigger id="language" className="w-[180px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <Label htmlFor="currency" className="text-base font-medium flex items-center gap-2">
                    <DollarSign /> Currency
                </Label>
                <p className="text-sm text-muted-foreground">
                    Choose your display currency.
                </p>
            </div>
            <Select defaultValue="usd">
                <SelectTrigger id="currency" className="w-[180px]">
                    <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

