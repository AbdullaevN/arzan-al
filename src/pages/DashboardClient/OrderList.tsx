import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  description: string;
  createdAt: string;
  status: string;
}

export const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Получаем заказы из localStorage или API
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
    setOrders(parsedOrders);
  }, []);

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const filteredOrders = orders.filter((order) =>
      order.id.includes(searchTerm)
    );
    setOrders(filteredOrders);
  };

  return (
    <div className="order-list">
      <h2>Ваши заказы</h2>

      {/* Поиск по заказам */}
      <input
        type="text"
        placeholder="Поиск по коду заказа"
        onChange={handleSearch}
      />

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Описание: {order.description}</p>
            <p>Дата создания: {order.createdAt}</p>
            <p>Статус: {order.status}</p>
            <button onClick={() => deleteOrder(order.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
