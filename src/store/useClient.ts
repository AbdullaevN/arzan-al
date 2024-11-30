import {create} from 'zustand';
import { API } from '../constants/api';
 
interface PriceState {
  price: number;
  setPrice: (price: number) => void;
  fetchPrice: () => Promise<void>;
}

const usePriceStore = create<PriceState>((set) => ({
  price: 0, // Начальное значение
  setPrice: (price) => set({ price }),
  fetchPrice: async () => {
    try {
      const response = await API.get('/api/orders/get-price');
      set({ price: response.data.price });
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  },
}));

export default usePriceStore;
