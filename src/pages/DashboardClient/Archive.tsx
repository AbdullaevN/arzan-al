import React, { useState, useEffect } from 'react';
import { API } from '../../constants/api';

interface Order {
  id: string;
  description: string;
  createdAt: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
  issued: boolean;  
}

export const Archive = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]); // State for displayed orders

  // Fetch data from the API
  const fetchHistory = async () => {
    try {
      const res = await API.get('/api/orders/history');
      const completedOrders = res.data.filter((order: Order) => order.issued === true);
      setOrders(completedOrders);
      setDisplayedOrders(completedOrders); // Set initial display orders
      console.log(completedOrders, 'completed orders');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    setDisplayedOrders(updatedOrders); // Update displayed orders as well
  };

  // Update search term on input change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Execute search on button click
  const performSearch = () => {
    const filteredOrders = orders.filter((order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedOrders(filteredOrders); // Update displayed orders based on search
  };

  return (
    <div className="order-list p-4 container flex flex-col items-start">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      {/* Поиск по заказам */}
      <div className="mt-4 mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          value={searchTerm}
          onChange={handleSearchInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={performSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Искать
        </button>
      </div>

      <div className="grid gap-4">
        {displayedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md p-4 rounded-lg border border-gray-200 relative max-w-sm overflow-hidden"
          >
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Заказ № {order.description}</h3>
              <button
                onClick={() => deleteOrder(order.id)}
                className="text-red-500 hover:text-red-700"
                title="Удалить заказ"
              >
                🗑️
              </button>
            </div>

            {/* Дата регистрации */}
            <p className="text-sm text-gray-600 mb-2">
              Дата регистрации: {order.createdAt}
            </p>

            {/* Этапы заказа */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={order.warehouseChina}
                  readOnly
                  className="mr-2"
                />
                <span>Склад в Китае</span>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={order.warehouseTokmok}
                  readOnly
                  className="mr-2"
                />
                <span>Склад в Бишкеке</span>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={order.deliveredToClient}
                  readOnly
                  className="mr-2"
                />
                <span>Выдан клиенту</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
