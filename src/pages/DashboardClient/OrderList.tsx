import React, { useState, useEffect } from 'react';
import { API } from '../../constants/api';

interface Order {
  id: string;
  description: string;
  createdAt: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
}

export const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders from API on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/api/orders');
        setOrders(res.data); // Assumes the API response is an array of orders
        localStorage.setItem('orders', JSON.stringify(res.data)); // Cache orders in localStorage
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Delete order from state and localStorage
  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  // Filter orders based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const storedOrders = localStorage.getItem('orders');
    const allOrders = storedOrders ? JSON.parse(storedOrders) : [];
    const filteredOrders = allOrders.filter((order: Order) =>
      order.id.includes(searchTerm)
    );
    setOrders(filteredOrders);
  };

  return (
    <div className="order-list p-4">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md p-4 rounded-lg border border-gray-200 relative max-w-sm rounded overflow-hidden shadow-lg"
          >
            <div className="flex justify-between bg-slate-700 py-2 px-4 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white">Заказ #{order.id}</h3>
              <button
                onClick={() => deleteOrder(order.id)}
                className="text-red-500 hover:text-red-700"
                title="Удалить заказ"
              >
                🗑️
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2 py-5">
              Дата регистрации: {order.createdAt}
            </p>

            <h4>{order.description}</h4>
            <h3>{order.createdAt}</h3>

            <div className="space-y-2">
              <div className="flex items-center">
                <label className="checkbox-container flex items-center text-lg cursor-pointer">
                  <span className="mr-2">Склад в Китае</span>
                  <input
                    type="checkbox"
                    checked={order.warehouseChina}
                    readOnly
                    className="opacity-0 absolute"
                  />
                  <span className="checkmark"></span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="checkbox-container flex items-center text-lg cursor-pointer">
                  <span className="mr-2">Токмок - склад в Бишкеке</span>
                  <input
                    type="checkbox"
                    checked={order.warehouseTokmok}
                    readOnly
                    className="opacity-0 absolute"
                  />
                  <span className="checkmark"></span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="checkbox-container flex items-center text-lg cursor-pointer">
                  <span className="mr-2">Выдан клиенту</span>
                  <input
                    type="checkbox"
                    checked={order.deliveredToClient}
                    readOnly
                    className="opacity-0 absolute"
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
