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
import { ArrowRight, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SignupDetailsPage() {
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <User />
          <CardTitle className="text-2xl">Your Details</CardTitle>
        </div>
        <CardDescription>
          Please provide your legal name and email address.
        </CardDescription>
        <Progress value={100} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              placeholder="e.g., Alex Doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">
              Complete Setup <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          By continuing, you agree to our{' '}
          <Link href="#" className="underline">
            Terms of Service
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}
