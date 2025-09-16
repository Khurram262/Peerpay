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

export default function SettingsPage() {
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
          <CardDescription>
            Enhance your account security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="2fa" className="text-base">Two-Factor Authentication</Label>
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
                    It&apos;s a good idea to use a strong password that you&apos;re not using elsewhere.
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
                    Manage your connected bank accounts and cards for funding and withdrawals.
                    </CardDescription>
                </div>
                <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> Link New Account
                </Button>
            </div>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="border p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Landmark className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Main Savings Account</p>
                        <p className="text-sm text-muted-foreground">Capital Bank •••• 1234</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">Remove</Button>
            </div>
            <div className="border p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Visa Debit</p>
                        <p className="text-sm text-muted-foreground">Global Trust Bank •••• 5678</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">Remove</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
