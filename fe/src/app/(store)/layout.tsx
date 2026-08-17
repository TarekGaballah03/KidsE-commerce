import React from 'react';
import { Header } from '../../components/store/header';
import { Footer } from '../../components/store/footer';
import { CartDrawer } from '../../components/cart/cart-drawer';
import { FloatingCart } from '../../components/cart/floating-cart';
import { FlyingCartAnimator } from '../../components/cart/flying-cart-animator';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f8] text-[#1c1b1b]">
      <Header />
      <main className="flex-1">{children}</main>
      <FloatingCart />
      <FlyingCartAnimator />
      <CartDrawer />
      <Footer />
    </div>
  );
}

