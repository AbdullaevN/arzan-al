import React, { useState, useEffect } from 'react';
import { API } from '../../constants/api';

interface Order {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  warehouseChina: boolean; // Ensure this is a boolean
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
  weight?: number;
  amount?: number;
  trackCode: number; // Keep this as number if it is supposed to be a track code
}


interface OrderListProps {
  orders: (Order & { deliveredToClient?: boolean })[]; // Make 'deliveredToClient' optional
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  useEffect(() => {
    console.log(orders); // Логируем заказ перед его рендером
    setFilteredOrders(orders);
  }, [orders]);

  const deleteOrder = async (trackCode: number) => {
    if (!trackCode) {
      console.error('Ошибка: нет trackCode заказа');
      return;
    }

    console.log('Удаляем заказ с trackCode:', trackCode);

    try {
      const response = await API.delete(`/delete/${trackCode}`); // Удаляем по trackCode
      console.log('Удален заказ:', response);
      const updatedOrders = filteredOrders.filter((order) => order.trackCode !== trackCode);
      setFilteredOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Ошибка при удалении заказа:', e);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = orders.filter((order) =>
      order.trackCode.toString().includes(searchTerm) || 
      order.description?.toLowerCase().includes(searchTerm)
    );
    setFilteredOrders(filtered);
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
        {filteredOrders.map((order) => (
          <div
            key={order.trackCode} // Используем trackCode как ключ
            className="bg-white shadow-md p-4 rounded-lg border border-gray-200 relative max-w-sm overflow-hidden"
          >
            <div className="flex justify-between bg-slate-700 py-2 px-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Заказ № {order.trackCode}</h3>
              <h3 className="text-lg font-semibold">Заказ № {order.name}</h3>
              <button
                onClick={() => {
                  if (!order.trackCode) {
                    console.error('trackCode не найден для заказа:', order);
                    return;
                  }
                  deleteOrder(order.trackCode); // Удаляем по trackCode
                }}
                className="text-red-500 hover:text-red-700"
                title="Удалить заказ"
              >
                🗑️
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2 py-5">
              Дата регистрации: {new Date(order.createdDate).toLocaleDateString('ru-RU')}
            </p>

            <h4>{order.description}</h4>
            <h3>{order.createdDate}</h3>

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
