import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../constants/api';

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [inputPrice, setInputPrice] = useState('');
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/orders/get-price');
        setInputPrice(response.data.price);
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  const sections = [
    { name: 'История заказов', path: '/history' },
    { name: 'Импорт', path: '/import' },
    { name: 'Клиенты', path: '/clients' },
    { name: 'Цена', path: '/pricing' },
    { name: 'Оплата', path: '/payment' },
  ];

  return (
    <div className="bg-image min-h-svh">
      <div className="p-8 container flex flex-col items-start w-full md:mx-auto">
        <h1 className="text-3xl font-bold text-start mb-8">Панель Администратора</h1>

        {loading ? ( // Показываем индикатор загрузки
          <div className="flex justify-center items-center h-16">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="p-6 my-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer">
            <span className="flex gap-3">
              Вы являетесь администратором склада, цена за кг: <h1 className="flex">{inputPrice}</h1> сом.
            </span>
          </div>
        )}

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
