
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
import { Skeleton } from '@/components/ui/skeleton';

const categoryIcons: Record<string, React.ElementType> = {
  'Subscriptions': Receipt,
  'Spending Habits': Coins,
  'Bills': Receipt,
  'General Savings': Lightbulb,
  'Income': TrendingUp,
};

function InsightsSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="bg-secondary">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>
      <div className="space-y-6">
        {[...Array(2)].map((_, index) => (
          <div key={index}>
            <div className="grid gap-4 md:grid-cols-12 items-start">
              <div className="md:col-span-1 flex justify-center">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <div className="md:col-span-11 space-y-3">
                <div className='flex items-center gap-2'>
                  <Skeleton className="h-7 w-1/2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>
                    <Skeleton className="h-5 w-28" />
                  </AlertTitle>
                  <AlertDescription>
                    <Skeleton className="h-4 w-full" />
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            {index < 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}


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

    // Simulate a longer loading time for demo purposes
    setTimeout(getInsights, 1500);
  }, []);

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
             <div className="p-3 bg-primary/10 rounded-full flex items-center justify-center">
                <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
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
            <InsightsSkeleton />
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
              <Card className="bg-secondary/50 dark:bg-secondary/20">
                 <CardHeader>
                    <CardTitle>Your Financial Summary</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-lg text-secondary-foreground">{insights.summary}</p>
                 </CardContent>
              </Card>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold tracking-tight">Your Action Plan</h3>
                {insights.insights.map((insight, index) => {
                  const Icon = categoryIcons[insight.category] || Lightbulb;
                  return (
                    <Card key={index} className="p-6 shadow-sm">
                      <div className="grid gap-4 md:grid-cols-12 items-start">
                        <div className="md:col-span-1 flex justify-center md:justify-start">
                          <div className="p-3 bg-muted rounded-full">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="md:col-span-11 space-y-2">
                          <div className='flex flex-wrap items-center gap-2'>
                            <h3 className="text-xl font-semibold tracking-tight">{insight.title}</h3>
                             <Badge variant="outline">{insight.category}</Badge>
                          </div>
                          <p className="text-muted-foreground">{insight.description}</p>
                          <Alert className="bg-primary/5 border-primary/20">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">Actionable Tip</AlertTitle>
                            <AlertDescription className="text-foreground">
                                {insight.tip}
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </Card>
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
