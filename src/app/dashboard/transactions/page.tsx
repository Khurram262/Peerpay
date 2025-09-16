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
import { transactions } from '@/lib/data';
import { format, parseISO } from 'date-fns';

export default function TransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A detailed list of all your account transactions.
        </CardDescription>
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
            {transactions.map((transaction) => (
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
                    <div className="font-medium">{transaction.name}</div>
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
                    className={transaction.type === 'received' ? 'bg-green-600' : ''}
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
                      : 'text-green-600'
                  }`}
                >
                  {transaction.type === 'sent' ? '-' : '+'} $
                  {transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
