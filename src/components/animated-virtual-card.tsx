'use client';

import React from 'react';
import type { virtualCards } from '@/lib/data';

export function AnimatedVirtualCard({
  card,
}: {
  card: typeof virtualCards[0];
}) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div
      className="group w-full max-w-sm h-56 [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of the card */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full rounded-xl p-6 flex flex-col justify-between text-white bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg">
            <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
            <div className="relative flex justify-between items-start z-10">
              <span className="text-xl font-semibold tracking-wider">PeerPay</span>
               <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-9 h-9 opacity-90 text-gray-300"
              >
                <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
                <path d="M6 12h.01" />
                <path d="M10 12h.01" />
                <path d= "M14 12h.01" />
              </svg>
            </div>
            <div className="relative text-center z-10">
              <p className="font-mono text-2xl tracking-widest text-white">
                •••• •••• •••• {card.last4}
              </p>
            </div>
            <div className="relative flex justify-between items-end z-10">
              <div>
                <p className="text-xs text-gray-200">Card Holder</p>
                <p className="font-medium tracking-wide text-white">{card.cardholder}</p>
              </div>
              <div>
                <p className="text-xs text-gray-200">Expires</p>
                <p className="font-medium tracking-wide text-white">{card.expiry}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back of the card */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
           <div className="relative w-full h-full rounded-xl p-6 flex flex-col justify-between">
            <div className="absolute top-8 left-0 w-full h-12 bg-emerald-900"></div>
             <div className="flex justify-end items-start pt-24">
                <p className="text-gray-200 text-sm pr-4">CVV</p>
                <div className="w-24 h-8 bg-white rounded-md flex items-center justify-end pr-2">
                    <p className="text-black font-mono tracking-widest italic">123</p>
                </div>
             </div>
             <div className="text-right text-xs text-gray-200/80">
                <p>This card is issued by PeerPay Inc. Use of this card constitutes acceptance of the terms and conditions.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
