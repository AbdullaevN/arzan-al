import   { useState } from 'react';
import { OrderForm } from './OrderForm';
import { OrderList } from './OrderList';
import { Archive } from './Archive';
import { Information } from './Information';

// Функции для отображения модальных окон, добавления заказов, удаления, и поиска.
 
const DashboardClient = () => {
  const [showForm, setShowForm] = useState(false); // Показывать форму создания заказа

  return (
    <div className="dashboard">
      <h1>Добро пожаловать в Личный Кабинет</h1>

      {/* Кнопка для создания нового заказа */}
      <button onClick={() => setShowForm(!showForm)} className="btn-create-order">
        {showForm ? 'Закрыть форму создания заказа' : 'Создать заказ'}
      </button>

      {/* Форма для создания заказа */}
      {showForm && <OrderForm />}

      <div className="dashboard-sections">
        {/* Раздел "Все заказы" */}
        <OrderList />

        {/* Раздел "Архив" */}
        <Archive />

        {/* Раздел "Информация" */}
        <Information />
      </div>
    </div>
  );
};

export default DashboardClient;
