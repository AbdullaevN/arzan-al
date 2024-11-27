// src/store/usePriceStore.ts
import { create } from 'zustand';

interface PriceStore {
  price: string;
  setPrice: (price: string) => void;

 
}
interface ClientStore {
  clientId: string | null;
  setClientId: (id: string) => void;
}

const usePriceStore = create<PriceStore>((set) => ({


  price: localStorage.getItem('price') || '0', // Загружаем цену из localStorage
  setPrice: (price: string) => {
    set({ price });
    localStorage.setItem('price', price); // Сохраняем цену в localStorage
  },
}));




export const useClientStore = create<ClientStore>((set) => ({
  clientId: localStorage.getItem('clientId'), // Load from localStorage
  setClientId: (id: string) => {
    set({ clientId: id });
    localStorage.setItem('clientId', id); // Save to localStorage
  },
}));


export default usePriceStore ;
