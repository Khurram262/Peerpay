'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { virtualCards, type VirtualCard, type CardTheme } from '@/lib/data';
import { CreditCard, PlusCircle, Trash, Ban, Palette } from 'lucide-react';
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const themeColors: Record<CardTheme, string> = {
  sky: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

function CreateCardDialog({
  onCreateCard,
}: {
  onCreateCard: (theme: CardTheme) => void;
}) {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('sky');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    onCreateCard(selectedTheme);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Virtual Card</DialogTitle>
          <DialogDescription>
            Customize and create a new card for your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">Cardholder Name</Label>
            <Input id="card-name" defaultValue="Alex Doe" />
          </div>
          <div className="space-y-2">
            <Label>Choose a Color Theme</Label>
            <div className="flex gap-3 pt-2">
              {Object.keys(themeColors).map((theme) => (
                <button
                  key={theme}
                  className={cn(
                    'h-10 w-10 rounded-full border-2 transition-all',
                    themeColors[theme as CardTheme],
                    selectedTheme === theme
                      ? 'border-primary ring-2 ring-ring'
                      : 'border-transparent'
                  )}
                  onClick={() => setSelectedTheme(theme as CardTheme)}
                  aria-label={`Select ${theme} theme`}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CardsPage() {
  const [cards, setCards] = useState<VirtualCard[]>(virtualCards);
  const { toast } = useToast();

  const handleToggleBlock = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              status: card.status === 'active' ? 'blocked' : 'active',
            }
          : card
      )
    );
    const card = cards.find(c => c.id === cardId);
    toast({
        title: `Card ${card?.status === 'active' ? 'Blocked' : 'Unblocked'}`,
        description: `Your card ending in ${card?.last4} has been ${card?.status === 'active' ? 'blocked' : 'unblocked'}.`,
    })
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    const card = cards.find(c => c.id === cardId);
    toast({
        title: 'Card Removed',
        description: `Your card ending in ${card?.last4} has been removed.`,
        variant: 'destructive',
    })
  };

  const handleCreateCard = (theme: CardTheme) => {
    const newCard: VirtualCard = {
      id: `card_${Date.now()}`,
      fullNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      expiry: `${Math.floor(1 + Math.random() * 12)
        .toString()
        .padStart(2, '0')}/${new Date().getFullYear() % 100 + 5}`,
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardholder: 'Alex Doe',
      isPrimary: false,
      status: 'active',
      theme,
    };
    setCards((prevCards) => [...prevCards, newCard]);
     toast({
        title: 'Card Created',
        description: 'Your new virtual card has been added to your account.',
    })
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Virtual Cards</CardTitle>
            <CardDescription>
              Manage your virtual cards for secure online spending.
            </CardDescription>
          </div>
          <CreateCardDialog onCreateCard={handleCreateCard} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-semibold flex items-center gap-2">
                  PeerPay Card{' '}
                  <span className="text-muted-foreground font-mono">
                    •••• {card.last4}
                  </span>
                  <span
                    className={cn(
                      'h-3 w-3 rounded-full',
                      themeColors[card.theme]
                    )}
                  ></span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {card.expiry}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              {card.isPrimary && (
                <div className="text-xs font-bold text-primary py-1 px-2 rounded-full bg-primary/10">
                  PRIMARY
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id={`block-switch-${card.id}`}
                  checked={card.status === 'blocked'}
                  onCheckedChange={() => handleToggleBlock(card.id)}
                  aria-label={
                    card.status === 'active' ? 'Block card' : 'Unblock card'
                  }
                />
                <Label
                  htmlFor={`block-switch-${card.id}`}
                  className="text-sm text-muted-foreground"
                >
                  {card.status === 'active' ? 'Active' : 'Blocked'}
                </Label>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={card.isPrimary}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently
                      delete your virtual card.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
