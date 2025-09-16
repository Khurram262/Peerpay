
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShieldCheck,
  UploadCloud,
  Camera,
  UserCheck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type VerificationStatus = 'not_verified' | 'pending' | 'verified';

export default function VerificationPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState<VerificationStatus>('not_verified');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const totalSteps = 3;

  useEffect(() => {
    if (step !== 2) return;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
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
            'Please enable camera permissions to complete verification.',
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
  }, [step, toast]);

  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setter(e.target.files[0]);
      }
    };

  const handleCaptureSelfie = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');
      setSelfie(dataUri);
      toast({ title: 'Selfie Captured!', description: 'You look great!' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setStatus('pending');
      setIsSubmitting(false);
      toast({
        title: 'Verification Submitted',
        description: 'Your documents are under review. This may take a few minutes.',
      });
    }, 2000);
  };
  
  const canProceed = () => {
    if (step === 1) return idFront && idBack;
    if (step === 2) return selfie;
    return false;
  }

  const renderContent = () => {
    if (status === 'verified') {
      return (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold">You are Verified!</h2>
          <p className="mt-2 text-muted-foreground">
            You have full access to all features of PeerPay.
          </p>
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Verification Pending</h2>
          <p className="mt-2 text-muted-foreground">
            Your documents are currently under review. We'll notify you once
            the process is complete.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="progress">Verification Progress</Label>
          <Progress id="progress" value={(step / totalSteps) * 100} className="w-full" />
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Step 1: Upload ID Document</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="id-front">Front of ID</Label>
                <FileUpload setter={setIdFront} file={idFront} id="id-front" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-back">Back of ID</Label>
                <FileUpload setter={setIdBack} file={idBack} id="id-back" />
              </div>
            </div>
             <p className="text-xs text-muted-foreground">Please upload a clear image of a government-issued ID (e.g., Driver's License, Passport).</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <h3 className="text-xl font-semibold">Step 2: Take a Selfie</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  {hasCameraPermission === false && (
                     <div className="absolute inset-0 flex items-center justify-center p-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Camera Access Denied</AlertTitle>
                          <AlertDescription>Please grant camera permission to continue.</AlertDescription>
                        </Alert>
                     </div>
                  )}
                </div>
                <Button onClick={handleCaptureSelfie} disabled={!hasCameraPermission}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Selfie
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Selfie Preview</Label>
                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                  {selfie ? (
                    <img src={selfie} alt="Selfie Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <p className="text-sm text-muted-foreground">Your selfie will appear here</p>
                  )}
                </div>
              </div>
            </div>
             <p className="text-xs text-muted-foreground">Make sure your face is well-lit and clearly visible. Remove any hats or glasses.</p>
          </div>
        )}

        {step === 3 && (
            <div className="space-y-6 text-center py-8">
                 <h3 className="text-xl font-semibold">Step 3: Review and Submit</h3>
                 <p className="text-muted-foreground">Please confirm that your documents are clear and your selfie is visible.</p>
                 <div className="flex justify-center">
                    <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit for Verification
                    </Button>
                 </div>
            </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(s => Math.max(1, s-1))} disabled={step === 1 || isSubmitting}>
            Previous
          </Button>
           <Button onClick={() => setStep(s => Math.min(totalSteps, s+1))} disabled={!canProceed() || step === totalSteps || isSubmitting}>
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Identity Verification (KYC)</CardTitle>
                <CardDescription>
                  Secure your account and unlock all features by verifying your
                  identity.
                </CardDescription>
              </div>
            </div>
            <Badge variant={status === 'verified' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'} className={status === 'verified' ? 'bg-green-500/80': ''}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

function FileUpload({
  id,
  file,
  setter,
}: {
  id: string;
  file: File | null;
  setter: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  return (
    <div className="w-full">
      <Input
        id={id}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
          }
        }}
      />
      <Label
        htmlFor={id}
        className="cursor-pointer"
      >
        <div className="aspect-video w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
          {preview ? (
            <img src={preview} alt="ID preview" className="w-full h-full object-contain rounded-lg" />
          ) : (
            <>
              <UploadCloud className="h-8 w-8" />
              <span className="mt-2 text-sm">Click to upload</span>
            </>
          )}
        </div>
      </Label>
       {file && (
        <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
      )}
    </div>
  );
}
