
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
import { transactions as allTransactions, type Transaction } from '@/lib/data';
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
import { Search } from 'lucide-react';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((transaction) => {
        if (filterType === 'all') return true;
        return transaction.type === filterType;
      })
      .filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, filterType]);

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
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Details</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={transaction.avatar}
                          alt={transaction.name}
                          data-ai-hint="person face"
                        />
                        <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                          {transaction.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={
                        transaction.type === 'sent'
                          ? 'destructive'
                          : transaction.type === 'received'
                          ? 'default'
                          : 'secondary'
                      }
                      className={transaction.type === 'received' ? 'bg-primary' : ''}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(parseISO(transaction.date), 'MMMM d, yyyy')}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === 'sent'
                        ? 'text-destructive'
                        : 'text-primary'
                    }`}
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
