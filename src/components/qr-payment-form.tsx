'use client';

import React, { useState } from 'react';
import { QrCode, Upload, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { processQrCode } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type QRPaymentFromImageOutput } from '@/ai/flows/qr-payment-from-image';
import { Label } from './ui/label';

export function QrPaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<QRPaymentFromImageOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('qrCodeImageFile', file);

    const result = await processQrCode(formData);

    setIsLoading(false);

    if (result.success) {
      setPaymentDetails(result.data);
      setIsDialogOpen(true);
    } else {
      toast({
        title: 'Payment Scan Failed',
        description: result.error,
        variant: 'destructive',
      });
      setFileName('');
    }
  };

  const handlePay = () => {
    setIsDialogOpen(false);
    toast({
      title: 'Payment Sent!',
      description: `Successfully sent $${paymentDetails?.paymentAmount} to ${paymentDetails?.recipientAddress}.`,
    });
    setPaymentDetails(null);
    setFileName('');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scan & Pay</CardTitle>
          <CardDescription>
            Pay instantly by uploading a QR code image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex justify-center items-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {fileName ? `Selected: ${fileName}` : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-muted-foreground/70">
                PNG, JPG, GIF up to 4MB
              </p>
            </div>
            <Input
              ref={fileInputRef}
              id="qr-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/webp"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isLoading} onClick={() => fileInputRef.current?.click()}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Scanning...' : 'Select Image'}
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please review the payment details extracted from the QR code before
              confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={paymentDetails?.recipientAddress || ''}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                value={paymentDetails?.paymentAmount.toFixed(2) || ''}
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePay}>
              <Send className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
