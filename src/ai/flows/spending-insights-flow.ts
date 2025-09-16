'use server';

/**
 * @fileOverview An AI-powered spending insights generator.
 *
 * - getSpendingInsights - A function that analyzes transaction history and provides saving tips.
 * - SpendingInsightsInput - The input type for the getSpendingInsights function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsights function.
 */

import { ai } from '@/ai/genkit';
import type { Transaction } from '@/lib/data';
import { z } from 'genkit';

const TransactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  amount: z.number(),
  date: z.string(),
  type: z.enum(['sent', 'received', 'top-up']),
});

const SpendingInsightsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe("A list of the user's recent transactions."),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const InsightSchema = z.object({
  title: z.string().describe('A short, catchy title for the saving tip.'),
  description: z.string().describe('A one-sentence description of the insight or observation.'),
  tip: z.string().describe('A practical, actionable tip for the user to save money based on the observation.'),
  category: z.enum(['Subscriptions', 'Spending Habits', 'Bills', 'General Savings', 'Income']),
});

const SpendingInsightsOutputSchema = z.object({
  insights: z.array(InsightSchema).describe('An array of personalized spending insights and saving tips.'),
  summary: z.string().describe('A brief, encouraging summary of the user\'s overall financial health based on the transactions.'),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsights(input: SpendingInsightsInput): Promise<SpendingInsightsOutput> {
  return spendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingInsightsPrompt',
  input: { schema: SpendingInsightsInputSchema },
  output: { schema: SpendingInsightsOutputSchema },
  prompt: `You are a friendly and encouraging financial advisor AI. Your goal is to analyze a user's transaction history and provide personalized, actionable tips to help them save money.

Analyze the following JSON array of transactions:
\`\`\`json
{{{json transactions}}}
\`\`\`

Based on this data, generate a few distinct insights. For each insight, provide a short title, a simple one-sentence observation about their spending, an actionable tip, and categorize it. Categories can be 'Subscriptions', 'Spending Habits', 'Bills', 'General Savings', or 'Income'.

Finally, write a brief, positive, and encouraging summary of their financial activity. Focus on what they are doing well, even if there are areas for improvement.

Output the entire response in the specified JSON format.
`,
});

const spendingInsightsFlow = ai.defineFlow(
  {
    name: 'spendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
