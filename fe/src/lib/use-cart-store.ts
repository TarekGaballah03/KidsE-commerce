import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

export interface FlyingAnimationItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  freeShippingThreshold: number;
  flyingItems: FlyingAnimationItem[];
  lastAddedItem: CartItem | null;
  lastAddedTimestamp: number;
  isBumping: boolean;
  
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    item: Omit<CartItem, 'quantity'> & { quantity?: number },
    sourceCoords?: { x: number; y: number }
  ) => void;
  removeFlyingItem: (id: string) => void;
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
      flyingItems: [],
      lastAddedItem: null,
      lastAddedTimestamp: 0,
      isBumping: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem, sourceCoords) => {
        const qtyToAdd = newItem.quantity || 1;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (i) => i.productId === newItem.productId && i.variantId === newItem.variantId,
        );

        let updatedItems: CartItem[];
        let fullItem: CartItem;

        if (existingIndex > -1) {
          updatedItems = [...currentItems];
          const newQty = Math.min(updatedItems[existingIndex].quantity + qtyToAdd, newItem.maxStock);
          fullItem = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
          updatedItems[existingIndex] = fullItem;
        } else {
          fullItem = { ...newItem, quantity: Math.min(qtyToAdd, newItem.maxStock) };
          // Put newest item first so the floating circular icon always showcases the active/latest item
          updatedItems = [fullItem, ...currentItems];
        }

        // Trigger flying animation item
        const animId = `fly-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const startX = sourceCoords?.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
        const startY = sourceCoords?.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 200);

        set((state) => ({
          items: updatedItems,
          lastAddedItem: fullItem,
          lastAddedTimestamp: Date.now(),
          isBumping: true,
          flyingItems: [
            ...state.flyingItems,
            {
              id: animId,
              image: newItem.image,
              startX,
              startY,
            },
          ],
        }));

        // Reset bump after animation completes
        setTimeout(() => {
          set({ isBumping: false });
        }, 1200);
      },

      removeFlyingItem: (id) => {
        set((state) => ({
          flyingItems: state.flyingItems.filter((item) => item.id !== id),
        }));
      },

      removeItem: (productId, variantId) => {
        set((state) => {
          const filtered = state.items.filter((i) => !(i.productId === productId && i.variantId === variantId));
          return {
            items: filtered,
            lastAddedItem: filtered.length > 0 ? filtered[0] : null,
          };
        });
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

      clearCart: () => set({ items: [], lastAddedItem: null }),

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

