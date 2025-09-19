

'use client';

import React from 'react';
import type { VirtualCard } from '@/lib/data';
import { Ban, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

function PeerPayLogo() {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white/90"
            fill="currentColor"
        >
            <title>PeerPay</title>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.063 16.313H7.937V7.687h4.063c1.312 0 2.375.438 3.187 1.313.813.875 1.219 2 .813 3.375-.406 1.375-1.25 2.375-2.531 3 .438.25.813.563 1.125.938.313.375.469.813.469 1.313v.188c0 .563-.25 1.063-.75 1.5-.5.438-1.125.688-1.875.688zm-2-6.563h-2v4.5h2c.75 0 1.375-.25 1.875-.75.5-.5.75-1.125.75-1.875s-.25-1.375-.75-1.875c-.5-.5-1.125-.75-1.875-.75z" />
        </svg>
    )
}

function MastercardLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-10 w-10"
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

const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
};

const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
};

export function AnimatedVirtualCard({ card, isVisible = false }: { card: VirtualCard, isVisible?: boolean }) {

  const cardBaseStyle =
    'absolute inset-0 w-full h-full rounded-2xl p-4 sm:p-6 text-white overflow-hidden shadow-2xl transition-transform duration-700 [backface-visibility:hidden]';
  const cardFrontStyle = `flex flex-col justify-between`;
  
  const cardBackgroundStyle = {
    background: `linear-gradient(to bottom right, ${card.theme.start}, ${card.theme.end})`,
  };

  return (
    <div className="group w-full max-w-[320px] mx-auto h-48 [perspective:1000px]">
      <div
        className={cn(
          'relative h-full w-full rounded-2xl [transform-style:preserve-3d] transition-transform duration-700',
           isVisible ? '[transform:rotateY(180deg)]' : '',
           "hover:[transform:rotateY(10deg)_scale(1.05)]"
        )}
      >
        {/* Front of the card */}
        <div
          className={cn(
            cardBaseStyle,
            cardFrontStyle,
          )}
          style={cardBackgroundStyle}
        >
          {card.status === 'blocked' && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-20">
              <Ban className="w-16 h-16 text-white/70" />
            </div>
          )}
          <div className="relative flex justify-between items-start z-10">
            <div>
              <span className="text-base font-semibold tracking-wider">
                {card.name || 'Virtual Card'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-white/80 rotate-90" />
              <PeerPayLogo />
            </div>
          </div>

          <div className="relative text-left z-10 space-y-2">
            <div className="flex items-center gap-4">
               <p className="font-mono text-lg sm:text-xl tracking-wider whitespace-nowrap">
                {isVisible ? formatCardNumber(card.fullNumber) : maskCardNumber(card.fullNumber)}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/80 uppercase">Card Holder</p>
                <p className="font-medium tracking-wide text-white text-sm">
                  {card.cardholder}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs text-white/80 uppercase text-right">
                    Expires
                  </p>
                  <p className="font-medium tracking-wide text-white text-sm">
                     {card.expiry}
                  </p>
                </div>
                <MastercardLogo />
              </div>
            </div>
          </div>
        </div>
        {/* Back of the card */}
        <div
          className={cn(
            cardBaseStyle,
            '[transform:rotateY(180deg)]'
          )}
          style={cardBackgroundStyle}
        >
          <div className="relative w-full h-full rounded-2xl p-0 flex flex-col justify-start">
            <div className="w-full h-10 bg-black/80 mt-6"></div>
            <div className="px-4 py-3 space-y-3">
              <div className="text-right">
                <p className="text-xs text-white/80 uppercase">CVV</p>
                <div className="h-8 bg-white rounded-md flex items-center justify-end pr-3">
                  <p className="text-black font-mono tracking-widest text-sm">
                    {card.cvv}
                  </p>
                </div>
              </div>
               <div className="flex justify-start items-center gap-2">
                <div className="h-6 w-1/2 bg-white/60 rounded"></div>
                <div className="h-6 w-1/4 bg-white/60 rounded"></div>
               </div>
            </div>
            <div className="text-[0.6rem] text-white/60 mt-auto px-4 pb-3 text-center">
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
