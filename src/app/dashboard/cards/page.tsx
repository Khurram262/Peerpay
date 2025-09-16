
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { initialVirtualCards, type VirtualCard, type CardTheme, user, setUser } from '@/lib/data';
import { CreditCard, PlusCircle, Trash, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
import { AnimatedVirtualCard } from '@/components/animated-virtual-card';

const defaultColor = '#0ea5e9';

function CreateCardDialog({
  onCreateCard,
}: {
  onCreateCard: (theme: CardTheme, cardholder: string) => void;
}) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [cardholderName, setCardholderName] = useState(user.name);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    onCreateCard(selectedColor, cardholderName);
    setIsOpen(false);
  };
  
  const previewCard: VirtualCard = {
    id: 'preview',
    fullNumber: '1234 5678 9876 5432',
    last4: '5432',
    expiry: 'MM/YY',
    cvv: '123',
    cardholder: cardholderName,
    isPrimary: false,
    status: 'active',
    theme: selectedColor,
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Virtual Card</DialogTitle>
          <DialogDescription>
            Customize and create a new card for your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">

          <div className="flex justify-center">
            <AnimatedVirtualCard card={previewCard} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-name">Cardholder Name</Label>
            <Input id="card-name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-color">Choose a Color</Label>
            <div className='flex items-center gap-4'>
              <Input id="card-color" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-16 h-10 p-1" />
              <Input type="text" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} placeholder='#0ea5e9' />
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

function OrderPhysicalCard() {
  const { toast } = useToast();
  const handleOrder = () => {
    toast({
      title: 'Order Placed',
      description: 'Your physical card has been ordered and will be shipped to your registered address.',
    });
  };
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Order a Physical Card</CardTitle>
        <CardDescription>
          Get a physical version of your PeerPay card for in-store purchases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The physical card will be linked to your primary account and will have the same number and security features as your primary virtual card. Shipping fees may apply.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleOrder}>
          <CreditCard className="mr-2 h-4 w-4" />
          Order Physical Card
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function CardsPage() {
  const [cards, setCardsState] = useState<VirtualCard[]>(initialVirtualCards);
  const { toast } = useToast();

  useEffect(() => {
    const storedCards = localStorage.getItem('virtualCards');
    const storedUser = localStorage.getItem('user');

    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards);
        if (Array.isArray(parsedCards)) {
          setCardsState(parsedCards);
        }
      } catch (e) {
        console.error("Failed to parse virtual cards from localStorage", e);
        setCardsState(initialVirtualCards);
      }
    }

    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
        }
    }
  }, []);
  
  const updateCards = (newCards: VirtualCard[]) => {
    setCardsState(newCards);
    localStorage.setItem('virtualCards', JSON.stringify(newCards));
    window.dispatchEvent(new Event('storage'));
  };


  const handleToggleBlock = (cardId: string) => {
    const newCards = cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              status: card.status === 'active' ? 'blocked' : 'active',
            }
          : card
      )
    updateCards(newCards);

    const card = cards.find(c => c.id === cardId);
    toast({
        title: `Card ${card?.status === 'active' ? 'Blocked' : 'Unblocked'}`,
        description: `Your card ending in ${card?.last4} has been ${card?.status === 'active' ? 'blocked' : 'unblocked'}.`,
    })
  };

  const handleRemoveCard = (cardId: string) => {
    const cardToRemove = cards.find((c) => c.id === cardId);
    let newCards = cards.filter((card) => card.id !== cardId);

    if (cardToRemove?.isPrimary && newCards.length > 0) {
        newCards[0].isPrimary = true;
    }
    
    updateCards(newCards);
    
    toast({
        title: 'Card Removed',
        description: `Your card ending in ${cardToRemove?.last4} has been removed.`,
        variant: 'destructive',
    })
  };

  const handleCreateCard = (theme: CardTheme, cardholder: string) => {
    const newCard: VirtualCard = {
      id: `card_${Date.now()}`,
      fullNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      expiry: `${Math.floor(1 + Math.random() * 12)
        .toString()
        .padStart(2, '0')}/${new Date().getFullYear() % 100 + 5}`,
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardholder: cardholder,
      isPrimary: cards.length === 0,
      status: 'active',
      theme,
    };
    
    const newUser = { ...user, name: cardholder };
    setUser(newUser);
    const newCards = [...cards, newCard].map(c => ({ ...c, cardholder: cardholder }));

    updateCards(newCards);

    toast({
        title: 'Card Created',
        description: 'Your new virtual card has been added to your account.',
    })
  };

  const handleSetPrimary = (cardId: string) => {
    const newCards = cards.map(c => ({...c, isPrimary: c.id === cardId}));
    updateCards(newCards);
    toast({
      title: 'Primary Card Updated',
      description: `Card ending in ${cards.find(c => c.id === cardId)?.last4} is now your primary card.`,
    });
  }

  return (
    <>
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
        <CardContent className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <div key={card.id} className="space-y-4">
              <AnimatedVirtualCard card={card} />
              <div className="flex justify-between items-center gap-2 p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                  {card.isPrimary ? (
                    <div className="text-xs font-bold text-primary py-1 px-2 rounded-full bg-primary/10 flex items-center gap-1">
                      <CheckCircle className='h-3 w-3' />
                      PRIMARY
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(card.id)}>Set as primary</Button>
                  )}
                  </div>
                  <div className="flex items-center gap-2">
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
            </div>
          ))}
          {cards.length === 0 && (
              <div className="text-center py-12 text-muted-foreground md:col-span-2">
                  <p>You have no virtual cards.</p>
                  <p className="text-sm">Create one to get started!</p>
              </div>
          )}
        </CardContent>
      </Card>
      <OrderPhysicalCard />
    </>
  );
}
