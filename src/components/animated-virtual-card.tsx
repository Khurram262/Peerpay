'use client';

import React from 'react';
import type { VirtualCard } from '@/lib/data';
import { Wifi, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

const themeClasses = {
  sky: 'from-sky-500 to-sky-700',
  emerald: 'from-emerald-500 to-emerald-700',
  amber: 'from-amber-500 to-amber-700',
  rose: 'from-rose-500 to-rose-700',
};

export function AnimatedVirtualCard({ card }: { card: VirtualCard }) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const formatCardNumber = (num: string) => {
    return num.replace(/\d{4}(?=\d)/g, '$& ');
  };

  const cardTheme = themeClasses[card.theme] || themeClasses.sky;

  return (
    <div
      className="group w-full max-w-sm h-56 [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front of the card */}
        <div className="absolute inset-0">
          <div
            className={cn(
              'relative w-full h-full rounded-xl p-6 flex flex-col justify-between text-white bg-gradient-to-br shadow-lg',
              cardTheme
            )}
          >
            {card.status === 'blocked' && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <Ban className="w-16 h-16 text-white/70" />
              </div>
            )}
            <div className="relative flex justify-between items-start z-10">
              <span className="text-xl font-semibold tracking-wider">
                PeerPay
              </span>
              <Wifi className="w-7 h-7 opacity-80" />
            </div>
            <div className="relative text-left z-10">
              <p className="font-mono text-2xl tracking-widest text-gray-200/90">
                •••• •••• •••• {card.last4}
              </p>
            </div>
            <div className="relative flex justify-between items-end z-10">
              <div>
                <p className="text-xs text-gray-300/80">Card Holder</p>
                <p className="font-medium tracking-wide text-gray-100">
                  {card.cardholder}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-300/80">Expires</p>
                <p className="font-medium tracking-wide text-gray-100">
                  {card.expiry}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Back of the card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full rounded-xl text-white [transform:rotateY(180deg)] [backface-visibility:hidden]',
            'bg-gradient-to-br',
            cardTheme
          )}
        >
          <div className="relative w-full h-full rounded-xl p-6 flex flex-col justify-between">
            <div className="absolute top-8 left-0 w-full h-12 bg-black/80"></div>
            <div className="text-right text-xs text-gray-300/80 pt-2">
              <p>For customer service call +1-234-567-890</p>
            </div>
            <div className="flex-1 flex flex-col justify-center items-end pr-4">
              <p className="text-gray-300 text-xs self-start mb-2 pl-2">
                Full Card Number
              </p>
              <div className="w-full h-9 bg-white/90 rounded-md flex items-center justify-start mb-4">
                <p className="text-black font-mono tracking-wider pl-4">
                  {formatCardNumber(card.fullNumber)}
                </p>
              </div>
              <div className="flex justify-end gap-4 w-full">
                <div className="text-right">
                  <p className="text-gray-300 text-xs">CVV</p>
                  <div className="w-20 h-8 bg-white/90 rounded-md flex items-center justify-end pr-2">
                    <p className="text-black font-mono tracking-widest">
                      {card.cvv}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-400/80">
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
