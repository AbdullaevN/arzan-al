// src/store/usePriceStore.ts
import { create } from 'zustand';

interface PriceStore {
  price: string;
  setPrice: (price: string) => void;
}

const usePriceStore = create<PriceStore>((set) => ({
  price: localStorage.getItem('price') || '0', // Загружаем цену из localStorage
  setPrice: (price: string) => {
    set({ price });
    localStorage.setItem('price', price); // Сохраняем цену в localStorage
  },
}));

export default usePriceStore;
