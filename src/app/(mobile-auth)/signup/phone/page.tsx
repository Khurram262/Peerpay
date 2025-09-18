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
import { ArrowRight, Smartphone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SignupPhonePage() {
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
            <Smartphone />
            <CardTitle className="text-2xl">Get Started</CardTitle>
        </div>
        <CardDescription>
          Enter your mobile number to create your PeerPay account.
        </CardDescription>
        <Progress value={0} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          <Link href="/signup/verify" className="w-full">
            <Button className="w-full">
              Continue <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
