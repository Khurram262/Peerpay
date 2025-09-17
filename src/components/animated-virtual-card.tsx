

'use client';

import React, { useRef, useState } from 'react';
import type { VirtualCard } from '@/lib/data';
import { Ban, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
};

const formatHiddenCardNumber = (cardNumber: string) => {
  return `**** **** **** ${cardNumber.slice(-4)}`;
};

export function AnimatedVirtualCard({ card, isVisible = false }: { card: VirtualCard, isVisible?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const rotateX = (y / height - 0.5) * -20;
    const rotateY = (x / width - 0.5) * 20;

    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      '--bg-x': `${bgX}%`,
      '--bg-y': `${bgY}%`,
    } as React.CSSProperties);
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    });
  };

  const cardBaseStyle =
    'absolute inset-0 w-full h-full rounded-2xl p-6 text-white overflow-hidden shadow-2xl transition-transform duration-300 [backface-visibility:hidden]';
  const cardFrontStyle = `flex flex-col justify-between`;
  
  const cardBackgroundStyle = {
    background: `radial-gradient(circle at var(--bg-x, 50%) var(--bg-y, 50%), hsla(0,0%,100%,.1), transparent 40%), linear-gradient(to bottom right, ${card.theme.start}, ${card.theme.end})`,
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="group w-full max-w-md mx-auto h-56 [transform-style:preserve-3d] transition-transform duration-300 ease-out"
    >
      <div
        className={cn(
          'relative h-full w-full rounded-2xl [transform-style:preserve-3d] transition-transform duration-700',
           isVisible ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front of the card */}
        <div
          className={cn(
            cardBaseStyle,
            cardFrontStyle,
            'border border-white/10',
          )}
          style={cardBackgroundStyle}
        >
          {card.status === 'blocked' && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-20">
              <Ban className="w-16 h-16 text-white/70" />
            </div>
          )}
          <div className="relative flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-wider">
                PeerPay
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="h-6 w-6 text-white/80 rotate-90" />
            </div>
          </div>

          <div className="relative text-left z-10 space-y-2">
            <div className="flex items-center gap-4">
               <p className="font-mono text-xl tracking-wider whitespace-nowrap md:text-2xl">
                {isVisible ? formatCardNumber(card.fullNumber) : formatHiddenCardNumber(card.fullNumber)}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/80 uppercase">Card Holder</p>
                <p className="font-medium tracking-wide text-white">
                  {card.cardholder}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs text-white/80 uppercase text-right">
                    Expires
                  </p>
                  <p className="font-medium tracking-wide text-white">
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
            '[transform:rotateY(180deg)] border border-white/10'
          )}
          style={cardBackgroundStyle}
        >
          <div className="relative w-full h-full rounded-2xl p-0 flex flex-col justify-start">
            <div className="w-full h-12 bg-black/80 mt-6"></div>
            <div className="px-6 py-4 space-y-4">
              <div className="text-right">
                <p className="text-xs text-white/80 uppercase">CVV</p>
                <div className="h-9 bg-white rounded-md flex items-center justify-end pr-4">
                  <p className="text-black font-mono tracking-widest">
                    {isVisible ? card.cvv : '***'}
                  </p>
                </div>
              </div>
               <div className="flex justify-start items-center gap-2">
                <div className="h-8 w-1/2 bg-white/60 rounded"></div>
                <div className="h-8 w-1/4 bg-white/60 rounded"></div>
               </div>
            </div>
            <div className="text-xs text-white/60 mt-auto px-6 pb-4 text-center">
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
