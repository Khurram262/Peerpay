
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Upload, Loader2, Send, Camera } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { type QRPaymentFromImageOutput } from '@/ai/flows/qr-payment-from-image';
import { Label } from './ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function CameraPayDialog({ onScan }: { onScan: (dataUri: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings.',
        });
      }
    };
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, toast]);

  const handleCaptureAndScan = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/png');
      onScan(dataUri);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Camera className="mr-2 h-4 w-4" />
          Pay with Camera
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan QR Code with Camera</DialogTitle>
          <DialogDescription>
            Point your camera at a QR code to scan it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
           {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature. You may need to
                refresh the page and grant permission.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCaptureAndScan} disabled={!hasCameraPermission}>
            <Camera className="mr-2 h-4 w-4" />
            Capture and Pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function QrPaymentForm({ onPayment }: { onPayment: (amount: number) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<QRPaymentFromImageOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileScan = async (file: File) => {
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
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileScan(file);
    }
  };

  const handleCameraScan = async (dataUri: string) => {
    setFileName('Camera Capture');
    setIsLoading(true);
    
    // Convert data URI to file
    const response = await fetch(dataUri);
    const blob = await response.blob();
    const file = new FormData();
    file.append('qrCodeImageFile', blob, 'camera.png');

    const result = await processQrCode(file);
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
    if (!paymentDetails) return;
    onPayment(paymentDetails.paymentAmount);
    setIsDialogOpen(false);
    toast({
      title: 'Payment Sent!',
      description: `Successfully sent $${paymentDetails?.paymentAmount.toFixed(2)} to ${paymentDetails?.recipientAddress}.`,
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
            Pay instantly by uploading or scanning a QR code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex justify-center items-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            <div className="text-center">
             {isLoading ? (
                <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {isLoading ? 'Scanning...' : fileName ? `Selected: ${fileName}` : 'Click to upload or drag & drop'}
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
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" disabled={isLoading} onClick={() => fileInputRef.current?.click()}>
            <QrCode className="mr-2 h-4 w-4" />
            Select Image
          </Button>
          <CameraPayDialog onScan={handleCameraScan} />
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
