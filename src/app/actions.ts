'use server';

import {
  qrPaymentFromImage,
  type QRPaymentFromImageOutput,
} from '@/ai/flows/qr-payment-from-image';
import { z } from 'zod';

const processQrCodeSchema = z.object({
  qrCodeImageFile: z.instanceof(File),
});

type ProcessQrCodeResult =
  | { success: true; data: QRPaymentFromImageOutput }
  | { success: false; error: string };

export async function processQrCode(
  formData: FormData
): Promise<ProcessQrCodeResult> {
  const file = formData.get('qrCodeImageFile') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF.',
    };
  }

  if (file.size > 4 * 1024 * 1024) {
    // 4MB limit
    return { success: false, error: 'File is too large. Maximum size is 4MB.' };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    const result = await qrPaymentFromImage({ qrCodeImage: dataUri });
    
    return { success: true, data: result };
  } catch (e) {
    console.error('QR Code processing error:', e);
    return {
      success: false,
      error:
        'Failed to extract details from QR code. Please ensure it is a valid payment QR code and try again.',
    };
  }
}
