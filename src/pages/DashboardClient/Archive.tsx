import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  description: string;
  createdAt: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
}

export const Archive = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Check for orders in localStorage
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Fake data to display initially if no orders in localStorage
      const initialOrders: Order[] = [
        {
          id: '12345',
          description: 'Order for electronics',
          createdAt: '2024-11-01',
          warehouseChina: true,
          warehouseTokmok: false,
          deliveredToClient: false,
        },
        {
          id: '67890',
          description: 'Order for clothing',
          createdAt: '2024-11-03',
          warehouseChina: true,
          warehouseTokmok: true,
          deliveredToClient: false,
        },
        {
          id: '11223',
          description: 'Order for furniture',
          createdAt: '2024-11-05',
          warehouseChina: true,
          warehouseTokmok: true,
          deliveredToClient: true,
        },
      ];
      setOrders(initialOrders);
      localStorage.setItem('orders', JSON.stringify(initialOrders));
    }
  }, []);

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const storedOrders = localStorage.getItem('orders');
    const allOrders = storedOrders ? JSON.parse(storedOrders) : [];

    // Filter orders based on search term
    const filteredOrders = allOrders.filter((order: Order) =>
      order.id.includes(searchTerm)
    );
    setOrders(filteredOrders);
  };

  return (
    <div className="order-list p-4 ">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      {/* Поиск по заказам */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md p-4 rounded-lg border border-gray-200 relative 
            max-w-sm rounded overflow-hidden shadow-lg  
            "
          >
            
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Заказ #{order.id}</h3>
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
                <span>Токмок - склад в Бишкеке</span>
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
