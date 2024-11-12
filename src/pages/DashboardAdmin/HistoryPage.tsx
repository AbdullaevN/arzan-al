// src/pages/HistoryPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: number;
  track: string;
  status: string;
  createdAt: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const orders: Order[] = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    track: `BBK-300${index}`,
    status: index % 2 === 0 ? 'В пути' : 'Доставлен',
    createdAt: `2024-11-07 18:${10 + index}:00`,
  }));

  const handleDetails = (orderId: number) => {
    navigate(`/history/${orderId}`); // Navigate to the details page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Хлебные крошки */}
      <nav className="text-sm mb-6">
        <ol className="list-reset flex text-gray-500">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">Главная</a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>История</li>
        </ol>
      </nav>

      {/* Поиск */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-gray-600 text-sm">Показано 1 - 15 из 257 результатов</p>
      </div>

      {/* Таблица заказов */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">#ID</th>
              <th className="px-4 py-2 border-b">Трек</th>
              <th className="px-4 py-2 border-b">Состояние</th>
              <th className="px-4 py-2 border-b">Дата и время создания</th>
              <th className="px-4 py-2 border-b">Подробнее</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-center">{order.id}</td>
                <td className="px-4 py-2 border-b text-center">{order.track}</td>
                <td className="px-4 py-2 border-b text-center">{order.status}</td>
                <td className="px-4 py-2 border-b text-center">{order.createdAt}</td>
                <td className="px-4 py-2 border-b text-center">
                  <button
                    onClick={() => handleDetails(order.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
