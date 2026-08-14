import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  freeShippingThreshold: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  setFreeShippingThreshold: (threshold: number) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      freeShippingThreshold: 500,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        const qtyToAdd = newItem.quantity || 1;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (i) => i.productId === newItem.productId && i.variantId === newItem.variantId,
        );

        let updatedItems: CartItem[];
        if (existingIndex > -1) {
          updatedItems = [...currentItems];
          const newQty = Math.min(updatedItems[existingIndex].quantity + qtyToAdd, newItem.maxStock);
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
        } else {
          updatedItems = [
            ...currentItems,
            { ...newItem, quantity: Math.min(qtyToAdd, newItem.maxStock) },
          ];
        }

        set({ items: updatedItems, isOpen: true });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.variantId === variantId)),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId && item.variantId === variantId) {
              return { ...item, quantity: Math.min(quantity, item.maxStock) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      setFreeShippingThreshold: (threshold) => set({ freeShippingThreshold: threshold }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'kids_fashion_cart',
      partialize: (state) => ({ items: state.items, freeShippingThreshold: state.freeShippingThreshold }),
    },
  ),
);
