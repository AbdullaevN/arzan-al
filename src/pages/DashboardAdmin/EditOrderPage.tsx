import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface OrderData {
  phone: string;
  firstName: string;
  lastName: string;
  code: string;
  password: string;
  isActive: boolean;
}

const EditOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("ID не передан!");
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5000/orders/${id}`)
      .then((response) => {
        console.log("Данные загружены:", response.data);
        setOrderData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setError('Ошибка загрузки данных.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>{error}</p>;
  if (!orderData) return <p>Данные не найдены</p>;

  const handleSave = () => {
    if (!id || !orderData) return;

    axios
      .put(`http://localhost:5000/orders/${id}`, orderData)
      .then(() => {
        alert('Данные успешно сохранены!');
        navigate('/clients');
      })
      .catch(() => alert('Ошибка сохранения.'));
  };

  const handleChange = (field: keyof OrderData, value: string | boolean) => {
    if (orderData) {
      setOrderData({ ...orderData, [field]: value });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold text-center mb-5">Редактировать клиента</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Телефон</label>
          <input
            type="text"
            value={orderData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Имя</label>
          <input
            type="text"
            value={orderData.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Фамилия</label>
          <input
            type="text"
            value={orderData.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Код</label>
          <input
            type="text"
            value={orderData.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            value={orderData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Активен</label>
          <input
            type="checkbox"
            checked={orderData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end mt-5 space-x-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Сохранить
        </button>
        <button
          onClick={() => navigate('/clients')}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default EditOrderPage;
