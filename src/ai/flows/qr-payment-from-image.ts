'use server';

/**
 * @fileOverview A QR code payment details extractor AI agent.
 *
 * - qrPaymentFromImage - A function that handles the extraction of payment details from a QR code image.
 * - QRPaymentFromImageInput - The input type for the qrPaymentFromImage function.
 * - QRPaymentFromImageOutput - The return type for the qrPaymentFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QRPaymentFromImageInputSchema = z.object({
  qrCodeImage: z
    .string()
    .describe(
      "A picture of a QR code containing payment details, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type QRPaymentFromImageInput = z.infer<typeof QRPaymentFromImageInputSchema>;

const QRPaymentFromImageOutputSchema = z.object({
  recipientAddress: z
    .string()
    .describe('The recipient address extracted from the QR code.'),
  paymentAmount: z
    .number()
    .describe('The payment amount extracted from the QR code.'),
});
export type QRPaymentFromImageOutput = z.infer<typeof QRPaymentFromImageOutputSchema>;

export async function qrPaymentFromImage(
  input: QRPaymentFromImageInput
): Promise<QRPaymentFromImageOutput> {
  return qrPaymentFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'qrPaymentFromImagePrompt',
  input: {schema: QRPaymentFromImageInputSchema},
  output: {schema: QRPaymentFromImageOutputSchema},
  prompt: `You are an expert AI assistant specialized in extracting payment details from QR codes.

You will receive an image of a QR code, and your task is to extract the recipient address and the payment amount from it.

Here is the QR code image: {{media url=qrCodeImage}}

Output the recipient address and payment amount in the specified JSON format.`,
});

const qrPaymentFromImageFlow = ai.defineFlow(
  {
    name: 'qrPaymentFromImageFlow',
    inputSchema: QRPaymentFromImageInputSchema,
    outputSchema: QRPaymentFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    