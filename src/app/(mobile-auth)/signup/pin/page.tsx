import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, KeyRound } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SignupPinPage() {
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound />
          <CardTitle className="text-2xl">Create a PIN</CardTitle>
        </div>
        <CardDescription>
          Secure your account with a 4-digit PIN.
        </CardDescription>
        <Progress value={66} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pin">New PIN</Label>
            <Input id="pin" type="password" placeholder="••••" required maxLength={4} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-pin">Confirm PIN</Label>
            <Input id="confirm-pin" type="password" placeholder="••••" required maxLength={4} />
          </div>
          <Link href="/signup/details" className="w-full">
            <Button className="w-full">
              Set PIN & Continue <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
