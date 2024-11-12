// src/pages/OrderDetailsPage.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const orderDetails = {
    trackCode: 'BBK-3005',
    createdAt: '2024-11-07 18:08:00',
    history: [
      { location: 'Кемин', route: 'Токмок Кемин', date: '2024-11-07 18:08:00' },
    ],
    issued: 'Не выдан',
    trackingStatus: 'Никто не добавил трек код в свой список',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Хлебные крошки */}
      <nav className="text-sm mb-6">
        <ol className="list-reset flex text-gray-500">
          <li>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Главная</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link to="/history" className="text-blue-500 hover:underline">История</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Детали заказа #{id}</li>
        </ol>
      </nav>

      {/* Детали заказа */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Детали заказа #{id}</h2>
        
        <p className="mb-2"><strong>Трек код:</strong> {orderDetails.trackCode}</p>
        <p className="mb-2"><strong>Создан в:</strong> {orderDetails.createdAt}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold">История:</h3>
          <ul className="list-disc pl-5">
            {orderDetails.history.map((event, index) => (
              <li key={index}>
                {event.location}: {event.route} в {event.date}
              </li>
            ))}
          </ul>
        </div>

        <p className="mb-2"><strong>Выдан:</strong> {orderDetails.issued}</p>
        <p><strong>Отслеживает трек:</strong> {orderDetails.trackingStatus}</p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
