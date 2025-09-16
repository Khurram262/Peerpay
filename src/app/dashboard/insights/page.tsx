'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BrainCircuit, Loader2, Lightbulb, AlertTriangle, Coins, TrendingUp, Receipt } from 'lucide-react';
import { transactions as allTransactions } from '@/lib/data';
import { type SpendingInsightsOutput } from '@/ai/flows/spending-insights-flow';
import { fetchSpendingInsights } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const categoryIcons: Record<string, React.ElementType> = {
  'Subscriptions': Receipt,
  'Spending Habits': Coins,
  'Bills': Receipt,
  'General Savings': Lightbulb,
  'Income': TrendingUp,
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<SpendingInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInsights = async () => {
      setIsLoading(true);
      setError(null);
      const result = await fetchSpendingInsights(allTransactions);
      if (result.success) {
        setInsights(result.data);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    getInsights();
  }, []);

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>AI Spending Insights</CardTitle>
              <CardDescription>
                Personalized tips to help you save money, powered by AI.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg">Analyzing your spending...</p>
              <p>Our AI is crafting personalized insights for you.</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Generating Insights</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {insights && (
            <div className="space-y-8">
              <Card className="bg-secondary text-secondary-foreground">
                 <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-lg">{insights.summary}</p>
                 </CardContent>
              </Card>

              <div className="space-y-6">
                {insights.insights.map((insight, index) => {
                  const Icon = categoryIcons[insight.category] || Lightbulb;
                  return (
                    <div key={index}>
                      <div className="grid gap-4 md:grid-cols-12 items-start">
                        <div className="md:col-span-1 flex justify-center">
                          <div className="p-3 bg-muted rounded-full">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="md:col-span-11 space-y-2">
                          <div className='flex items-center gap-2'>
                            <h3 className="text-xl font-semibold tracking-tight">{insight.title}</h3>
                             <Badge variant="outline">{insight.category}</Badge>
                          </div>
                          <p className="text-muted-foreground">{insight.description}</p>
                          <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Actionable Tip</AlertTitle>
                            <AlertDescription>
                                {insight.tip}
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                      {index < insights.insights.length - 1 && <Separator className="mt-6" />}
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
