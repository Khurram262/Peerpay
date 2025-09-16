
'use client';

import React from 'react';
import type { VirtualCard } from '@/lib/data';
import { Ban, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function MastercardLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-12 w-12"
      aria-label="Mastercard logo"
    >
      <circle fill="#EA001B" cx="18.5" cy="24" r="11.5" />
      <circle fill="#F79E1B" cx="29.5" cy="24" r="11.5" />
      <path
        fill="#FF5F00"
        d="M26.8,24A11.5,11.5,0,0,1,18.5,12.5a11.5,11.5,0,0,0,0,23,11.5,11.5,0,0,1,8.3-11.5Z"
      />
    </svg>
  );
}

const tierStyles = {
  green: {
    pattern: "bg-green-500/10",
    accent: "text-green-400",
  },
  gold: {
    pattern: "bg-amber-500/10",
    accent: "text-amber-400",
  },
  black: {
    pattern: "bg-gray-900/50",
    accent: "text-gray-400",
  }
}

export function AnimatedVirtualCard({ card }: { card: VirtualCard }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = React.useState(false);

  const formatCardNumber = (num: string) => {
    return num.match(/.{1,4}/g)?.join(' ') ?? '';
  };
  
  const cardStyle = {
    '--card-bg-color': card.theme,
  } as React.CSSProperties;

  const handleToggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailsVisible(prev => !prev);
    if (!isDetailsVisible) {
      setTimeout(() => setIsDetailsVisible(false), 5000); // Auto-hide after 5s
    }
  };
  
  const currentTier = tierStyles[card.tier || 'green'];

  return (
    <div
      className="group w-full h-56 [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative h-full w-full rounded-xl shadow-xl transition-transform duration-500 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div
            style={cardStyle}
            className={cn(
              'relative w-full h-full rounded-xl p-6 flex flex-col justify-between text-white bg-[--card-bg-color] shadow-lg overflow-hidden'
            )}
          >
             <div className={cn("absolute inset-0", currentTier.pattern)}></div>

            {card.status === 'blocked' && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-20">
                <Ban className="w-16 h-16 text-white/70" />
              </div>
            )}
            <div className="relative flex justify-between items-start z-10">
              <div className='flex items-center gap-2'>
                <span className="text-xl font-semibold tracking-wider">
                  PeerPay
                </span>
                <span className={cn('text-sm font-semibold uppercase', currentTier.accent)}>{card.tier}</span>
              </div>
              
               <div className="flex items-center gap-2">
                 <div className="w-12 h-8 bg-yellow-400/80 rounded-md shadow-inner-lg flex items-center justify-center">
                    <div className='w-8 h-5 bg-yellow-500/70 rounded-sm' />
                </div>
              </div>
            </div>

            <div className="relative text-left z-10 space-y-2">
              <div className="flex items-center gap-4">
                <p className="font-mono text-xl tracking-wider whitespace-nowrap md:text-2xl">
                  {isDetailsVisible ? formatCardNumber(card.fullNumber) : `**** **** **** ${card.last4}`}
                </p>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white" onClick={handleToggleDetails}>
                    {isDetailsVisible ? <EyeOff /> : <Eye />}
                    <span className="sr-only">View Card Details</span>
                 </Button>
              </div>

              <div className="flex justify-between items-end">
                  <div>
                      <p className="text-xs text-gray-200/80 uppercase">Card Holder</p>
                      <p className="font-medium tracking-wide text-gray-100">
                      {card.cardholder}
                      </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div>
                        <p className="text-xs text-gray-200/80 uppercase text-right">Expires</p>
                        <p className="font-medium tracking-wide text-gray-100">
                           {isDetailsVisible ? card.expiry : 'MM/YY'}
                        </p>
                    </div>
                    <MastercardLogo />
                  </div>
              </div>
            </div>
          </div>
        </div>
        {/* Back of the card */}
        <div
          style={cardStyle}
          className={cn(
            'absolute inset-0 h-full w-full rounded-xl text-white [transform:rotateY(180deg)] [backface-visibility:hidden]',
            'bg-[--card-bg-color]'
          )}
        >
          <div className={cn("absolute inset-0", currentTier.pattern)}></div>
          <div className="relative w-full h-full rounded-xl p-0 flex flex-col justify-start">
            <div className="w-full h-12 bg-black/80 mt-6"></div>
             <div className="px-6 py-4 space-y-4">
                <div className="text-right">
                    <p className="text-xs text-gray-300/80 uppercase">CVV</p>
                    <div className="h-9 bg-white rounded-md flex items-center justify-end pr-4">
                        <p className="text-black font-mono tracking-widest">
                        {card.cvv}
                        </p>
                    </div>
                </div>
                 <div className="h-8 w-3/4 bg-gray-300/80 rounded"></div>
            </div>
            <div className="text-xs text-gray-300/60 mt-auto px-6 pb-4 text-center">
              <p>
                This card is issued by PeerPay Inc. Use of this card
                constitutes acceptance of the terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
