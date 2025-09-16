
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
  slate: 'from-slate-600 to-slate-800',
  violet: 'from-violet-500 to-violet-700',
};

export function AnimatedVirtualCard({ card, forceFlip }: { card: VirtualCard, forceFlip?: boolean }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const cardTheme = themeClasses[card.theme] || themeClasses.sky;

  React.useEffect(() => {
    if (forceFlip !== undefined) {
      setIsFlipped(forceFlip);
    }
  }, [forceFlip]);

  const formatCardNumber = (num: string) => {
    return num.match(/.{1,4}/g)?.join(' ') ?? '';
  };

  return (
    <div
      className="group w-full max-w-sm h-56 [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div
            className={cn(
              'relative w-full h-full rounded-xl p-6 flex flex-col justify-between text-white bg-gradient-to-br shadow-lg overflow-hidden',
              cardTheme
            )}
          >
             <div className="absolute top-0 left-0 w-full h-full bg-black/10 mix-blend-overlay"></div>
             <div className="absolute -top-1/3 -right-1/4 w-48 h-48 bg-white/10 rounded-full blur-xl opacity-50"></div>
             <div className="absolute -bottom-1/4 -left-1/4 w-32 h-32 bg-white/10 rounded-full blur-lg opacity-40"></div>
            {card.status === 'blocked' && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-20">
                <Ban className="w-16 h-16 text-white/70" />
              </div>
            )}
            <div className="relative flex justify-between items-start z-10">
              <span className="text-xl font-semibold tracking-wider">
                PeerPay
              </span>
               <div className="flex items-center gap-2">
                 <div className="w-12 h-8 bg-yellow-400 rounded-md shadow-inner-lg flex items-center justify-center">
                    <div className='w-8 h-5 bg-yellow-500 rounded-sm' />
                </div>
              </div>
            </div>

            <div className="relative text-left z-10 space-y-4">
                <p className="font-mono text-xl tracking-widest">
                  {formatCardNumber(card.fullNumber)}
                </p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-200/80">Card Holder</p>
                        <p className="font-medium tracking-wide text-gray-100">
                        {card.cardholder}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-200/80">Expires</p>
                        <p className="font-medium tracking-wide text-gray-100">
                        {card.expiry}
                        </p>
                    </div>
                    <Wifi className="w-7 h-7 opacity-80" />
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
          <div className="relative w-full h-full rounded-xl p-0 flex flex-col justify-start">
            <div className="w-full h-12 bg-black/80 mt-6"></div>
             <div className="px-6 py-4 space-y-4">
                <div className="text-right">
                    <p className="text-xs text-gray-300/80">CVV</p>
                    <div className="h-9 bg-white rounded-md flex items-center justify-end pr-4">
                        <p className="text-black font-mono tracking-widest">
                        {card.cvv}
                        </p>
                    </div>
                </div>
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
