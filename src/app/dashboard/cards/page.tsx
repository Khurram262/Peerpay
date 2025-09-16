import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { virtualCards } from '@/lib/data';
import { CreditCard, PlusCircle } from 'lucide-react';

function VirtualCardDisplay({ card }: { card: typeof virtualCards[0] }) {
  return (
    <div className="border p-4 rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-4">
        <CreditCard className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-semibold">
            PeerPay Card{' '}
            <span className="text-muted-foreground font-mono">
              •••• {card.last4}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Expires {card.expiry}
          </p>
        </div>
      </div>
      {card.isPrimary && (
        <div className="text-xs font-bold text-primary py-1 px-2 rounded-full bg-primary/10">
          PRIMARY
        </div>
      )}
    </div>
  );
}

export default function CardsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Virtual Cards</CardTitle>
            <CardDescription>
              Manage your virtual cards for secure online spending.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Card
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {virtualCards.map((card) => (
          <VirtualCardDisplay key={card.id} card={card} />
        ))}
      </CardContent>
    </Card>
  );
}
