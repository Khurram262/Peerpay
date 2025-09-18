
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { transactions as allTransactions } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ArrowUpDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedTransactions = useMemo(() => {
    return allTransactions
      .filter((transaction) => {
        if (filterType === 'all') return true;
        return transaction.type === filterType;
      })
      .filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [searchTerm, filterType, sortOrder]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              A detailed list of all your account transactions.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="top-up">Top-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Details</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <div className="flex items-center gap-1">
                  Date <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length > 0 ? (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border hidden sm:flex">
                        <AvatarImage
                          src={transaction.avatar}
                          alt={transaction.name}
                          data-ai-hint="person face"
                        />
                        <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">
                           {format(parseISO(transaction.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={
                        transaction.type === 'sent'
                          ? 'destructive'
                          : transaction.type === 'received'
                          ? 'default'
                          : 'secondary'
                      }
                      className={cn(
                        transaction.type === 'sent' && 'bg-red-500/10 text-red-700 dark:bg-red-900/50 dark:text-red-400 border-red-500/20',
                        transaction.type === 'received' && 'bg-green-500/10 text-green-700 dark:bg-green-900/50 dark:text-green-400 border-green-500/20',
                      )}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(parseISO(transaction.date), 'MMMM d, yyyy')}
                  </TableCell>
                  <TableCell
                    className={cn('text-right font-semibold',
                      transaction.type === 'sent'
                        ? 'text-red-600 dark:text-red-400'
                        : transaction.type === 'received'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-muted-foreground'
                    )}
                  >
                    {transaction.type === 'sent' ? '-' : '+'} $
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No transactions found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
