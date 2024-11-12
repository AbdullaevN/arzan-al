 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState('');

  const handleSave = () => {
    // Логика сохранения цены
    console.log("Цена сохранена:", price);
  };

  const handleCancel = () => {
    navigate('/dashboard');
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
          <li>Цена</li>
        </ol>
      </nav>

      {/* Поле для ввода цены */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <label htmlFor="price" className="block text-lg font-semibold text-gray-700 mb-4">Введите цену</label>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Введите цену"
        />
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
        >
          Отменить
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default PricingPage;
