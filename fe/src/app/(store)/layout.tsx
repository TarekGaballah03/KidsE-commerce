import React from 'react';
import { Header } from '../../components/store/header';
import { Footer } from '../../components/store/footer';
import { CartDrawer } from '../../components/cart/cart-drawer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f2] text-slate-800">
      <Header />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
