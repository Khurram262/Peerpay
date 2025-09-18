

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
import { CreditCard, PlusCircle, Trash, CheckCircle, Edit, Snowflake, Wifi, ShoppingBag } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

const availableThemes: Record<string, CardTheme> = {
  blue: { start: 'hsl(221.2 83.2% 53.3%)', end: 'hsl(221.2 83.2% 43.3%)' },
  green: { start: 'hsl(142.1 76.2% 36.3%)', end: 'hsl(142.1 76.2% 26.3%)' },
  gold: { start: '#f59e0b', end: '#fcd34d' },
  black: { start: '#171717', end: '#525252' },
  purple: { start: '#7e22ce', end: '#a855f7' },
  rose: { start: '#e11d48', end: '#fb7185' },
};


function CreateCardDialog({
  onCreateCard,
}: {
  onCreateCard: (theme: CardTheme, cardholder: string, name: string) => void;
}) {
  const [selectedTheme, setSelectedTheme] = useState(availableThemes.blue);
  const [cardholderName, setCardholderName] = useState(user.name);
  const [cardName, setCardName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    onCreateCard(selectedTheme, cardholderName, cardName);
    setIsOpen(false);
    setCardName('');
  };
  
  const previewCard: VirtualCard = {
    id: 'preview',
    name: cardName || 'Virtual Card',
    fullNumber: '1234567898765432',
    last4: '5432',
    expiry: 'MM/YY',
    cvv: '123',
    cardholder: cardholderName,
    isPrimary: false,
    status: 'active',
    theme: selectedTheme,
    settings: {
        allowOnline: true,
        allowContactless: true,
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Virtual Card</DialogTitle>
          <DialogDescription>
            Customize and create a new card for your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">

          <div className="flex justify-center">
            <AnimatedVirtualCard card={previewCard} isVisible={true} />
          </div>
          <div className="space-y-2">
            <Label>Card Color</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(availableThemes).map(([name, theme]) => (
                <button
                  key={name}
                  onClick={() => setSelectedTheme(theme)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-all',
                    selectedTheme.start === theme.start ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'
                  )}
                  style={{ background: `linear-gradient(to bottom right, ${theme.start}, ${theme.end})` }}
                  aria-label={`Select ${name} theme`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-name-input">Card Name</Label>
            <Input id="card-name-input" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="e.g. Online Shopping" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input id="cardholder-name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} />
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
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState({
    name: user.name,
    line1: '123 Main St',
    line2: '',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'USA',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddress(prev => ({...prev, [id]: value}));
  }

  const handleOrder = () => {
    toast({
      title: 'Order Placed',
      description: `Your physical card will be shipped to: ${address.line1}, ${address.city}.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        <DialogTrigger asChild>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Order Physical Card
          </Button>
        </DialogTrigger>
      </CardFooter>
    </Card>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Shipping Address</DialogTitle>
          <DialogDescription>
            Please enter the name and address where you want your physical card to be shipped.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={address.name} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="line1">Address Line 1</Label>
            <Input id="line1" value={address.line1} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="line2">Address Line 2 (Optional)</Label>
            <Input id="line2" value={address.line2} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={address.city} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" value={address.state} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zip">ZIP/Postal Code</Label>
              <Input id="zip" value={address.zip} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={address.country} onChange={handleInputChange} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleOrder}>Confirm and Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditCardDialog({ card, onUpdate, children }: { card: VirtualCard, onUpdate: (newName: string) => void, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(card.name);

  const handleSave = () => {
    onUpdate(name);
    setIsOpen(false);
  }

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Change the name of your virtual card.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="card-name-edit">Card Name</Label>
            <Input
              id="card-name-edit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Online Shopping"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default function CardsPage() {
  const [cards, setCardsState] = useState<VirtualCard[]>(initialVirtualCards);
  const [visibleCardId, setVisibleCardId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCards = localStorage.getItem('virtualCards');
    const storedUser = localStorage.getItem('user');

    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards);
        if (Array.isArray(parsedCards)) {
          // Add settings if they don't exist from previous versions
          const updatedCards = parsedCards.map(c => ({
              ...c,
              settings: c.settings || { allowOnline: true, allowContactless: true }
          }))
          setCardsState(updatedCards);
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


  const handleToggleFreeze = (cardId: string) => {
    const newCards = cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              status: card.status === 'blocked' ? 'active' : 'blocked',
            }
          : card
      )
    updateCards(newCards);

    const card = cards.find(c => c.id === cardId);
    toast({
        title: `Card ${card?.status === 'active' ? 'Frozen' : 'Unfrozen'}`,
        description: `Your card ending in ${card?.last4} has been ${card?.status === 'active' ? 'frozen' : 'unfrozen'}.`,
    })
  };

  const handleToggleSetting = (cardId: string, setting: 'allowOnline' | 'allowContactless') => {
      const newCards = cards.map(card => {
          if (card.id === cardId) {
              return { ...card, settings: { ...card.settings, [setting]: !card.settings[setting] }};
          }
          return card;
      });
      updateCards(newCards);
  }

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

  const handleCreateCard = (theme: CardTheme, cardholder: string, name: string) => {
    const newCard: VirtualCard = {
      id: `card_${Date.now()}`,
      name: name || 'Virtual Card',
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
      settings: {
          allowOnline: true,
          allowContactless: true,
      }
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

  const handleUpdateCardName = (cardId: string, newName: string) => {
    const newCards = cards.map(c => c.id === cardId ? { ...c, name: newName } : c);
    updateCards(newCards);
    toast({
        title: 'Card Updated',
        description: 'Your card name has been changed.'
    })
  }

  const handleToggleVisibility = (cardId: string) => {
    if (visibleCardId === cardId) {
      setVisibleCardId(null);
    } else {
      setVisibleCardId(cardId);
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Virtual Cards</CardTitle>
              <CardDescription>
                Manage your virtual cards for secure online spending. Click on a card to flip it.
              </CardDescription>
            </div>
            <CreateCardDialog onCreateCard={handleCreateCard} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          {cards.map((card) => (
            <div key={card.id} className="space-y-4 p-4 border rounded-xl shadow-sm">
              <div onClick={() => handleToggleVisibility(card.id)} className="cursor-pointer">
                <AnimatedVirtualCard card={card} isVisible={visibleCardId === card.id} />
              </div>

               {card.isPrimary && (
                  <div className="text-xs font-bold text-primary py-1 px-2 rounded-full bg-primary/10 flex items-center gap-1 w-fit">
                    <CheckCircle className='h-3 w-3' />
                    PRIMARY
                  </div>
                )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor={`freeze-switch-${card.id}`} className="font-medium">Freeze Card</Label>
                  </div>
                  <Switch
                    id={`freeze-switch-${card.id}`}
                    checked={card.status === 'blocked'}
                    onCheckedChange={() => handleToggleFreeze(card.id)}
                    aria-label={card.status === 'active' ? 'Freeze card' : 'Unfreeze card'}
                  />
                </div>
                <Separator />
                 <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor={`online-switch-${card.id}`} className="font-medium">Online Transactions</Label>
                  </div>
                  <Switch
                    id={`online-switch-${card.id}`}
                    checked={card.settings.allowOnline}
                    onCheckedChange={() => handleToggleSetting(card.id, 'allowOnline')}
                    aria-label="Toggle online transactions"
                  />
                </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor={`contactless-switch-${card.id}`} className="font-medium">Contactless / Tap & Pay</Label>
                  </div>
                  <Switch
                    id={`contactless-switch-${card.id}`}
                    checked={card.settings.allowContactless}
                    onCheckedChange={() => handleToggleSetting(card.id, 'allowContactless')}
                    aria-label="Toggle contactless payments"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                  {!card.isPrimary && (
                    <Button variant="outline" size="sm" onClick={() => handleSetPrimary(card.id)}>Set as primary</Button>
                  )}
                  <EditCardDialog card={card} onUpdate={(name) => handleUpdateCardName(card.id, name)}>
                      <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                  </EditCardDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-auto"
                        disabled={card.isPrimary}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Remove
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
          {cards.length === 0 && (
              <div className="text-center py-12 text-muted-foreground md:col-span-2">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold">You have no virtual cards.</p>
                  <p className="text-sm">Create one to get started!</p>
              </div>
          )}
        </CardContent>
      </Card>
      <OrderPhysicalCard />
    </>
  );
}
