// src/pages/DashboardAdmin.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    // { name: 'Добавить заказ', path: '/add' },
    { name: 'История заказов', path: '/history' },
    { name: 'Импорт', path: '/import' },
    // { name: 'Выдать товар клиенту', path: '/issue-product' },
    // { name: 'Импорт выданных товаров', path: '/issued-imports' },
    { name: 'Клиенты', path: '/clients' },
    { name: 'Цена', path: '/pricing' },
    { name: 'Оплата', path: '/payment' },
  ];

  return (
    <div className='bg-image  '>

    <div className=" min-h-full   p-8 container flex flex-col items-start w-full">
      <h1 className="text-3xl font-bold text-start mb-8">Панель Администратора</h1>

    
      <div
           
            className="p-6   my-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
          >
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.name}</h2>
            <p className="text-gray-600">Перейти на страницу {section.name.toLowerCase()}.</p> */}
            <span>Вы являетесь администратором склада: Токмок Кемин, цена за кг: 282 сом.
            </span>
          </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            onClick={() => navigate(section.path)}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.name}</h2>
            <p className="text-gray-600">Перейти на страницу {section.name.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
};

export default DashboardAdmin;
