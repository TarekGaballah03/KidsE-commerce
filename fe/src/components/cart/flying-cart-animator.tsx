'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore, FlyingAnimationItem } from '../../lib/use-cart-store';

interface FlyingElementProps {
  item: FlyingAnimationItem;
  targetPos: { x: number; y: number };
  onComplete: () => void;
}

function FlyingElement({ item, targetPos, onComplete }: FlyingElementProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 750);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const dx = targetPos.x - item.startX;
  const dy = targetPos.y - item.startY;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: item.startX - 32,
        top: item.startY - 32,
        '--fly-x': `${dx}px`,
        '--fly-y': `${dy}px`,
      } as React.CSSProperties}
    >
      <div
        style={{
          animation: 'fly-parabolic 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        }}
        className="w-16 h-16 rounded-full p-1 bg-white shadow-2xl border-2 border-[#1a1a1a] flex items-center justify-center overflow-hidden ring-4 ring-[#1a1a1a]/10"
      >
        <img
          src={item.image}
          alt="Product added"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {/* Subtle sparkle effect */}
      <div
        style={{
          animation: 'pulse-ring 0.75s ease-out forwards',
        }}
        className="absolute inset-0 rounded-full bg-[#1a1a1a]/20 scale-150"
      />
    </div>
  );
}

export function FlyingCartAnimator() {
  const { flyingItems, removeFlyingItem } = useCartStore();
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateTarget = () => {
      const anchor = document.getElementById('floating-cart-anchor');
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        setTargetPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      } else {
        setTargetPos({
          x: window.innerWidth - 60,
          y: window.innerHeight - 60,
        });
      }
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget);
    return () => {
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget);
    };
  }, []);

  if (flyingItems.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {flyingItems.map((item) => (
        <FlyingElement
          key={item.id}
          item={item}
          targetPos={targetPos}
          onComplete={() => removeFlyingItem(item.id)}
        />
      ))}
    </div>
  );
}
