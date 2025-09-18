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
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SignupVerifyPage() {
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck />
          <CardTitle className="text-2xl">Verify Your Number</CardTitle>
        </div>
        <CardDescription>
          We sent a 6-digit code to your mobile number.
        </CardDescription>
         <Progress value={33} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">Verification Code (OTP)</Label>
            <Input id="otp" type="text" placeholder="_ _ _ _ _ _" required />
          </div>
          <Link href="/signup/pin" className="w-full">
            <Button className="w-full">
              Verify & Continue <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Didn&apos;t receive a code?{' '}
          <Link href="#" className="underline">
            Resend
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
