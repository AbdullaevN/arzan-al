import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../../constants/api';

interface OrderData {
  phone: string;
  firstName: string;
  lastName: string;
  code: string;
  password: string;
  isActive: boolean;
}

const EditOrderPage: React.FC = () => {
  const { trackCode } = useParams<{ trackCode: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order data
  useEffect(() => {
    if (!trackCode) {
      setError('TrackCode не передан.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/orders/edit/${trackCode}`);
        setOrderData(response.data);
        console.log('TrackCode:', trackCode);

      } catch (err: any) {
        console.error('Ошибка загрузки данных:', err.message);
        setError('Не удалось загрузить данные. Проверьте соединение или TrackCode.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trackCode]);

  if (!trackCode) {
    return <p>TrackCode отсутствует. Пожалуйста, проверьте URL.</p>;
  }

  // Save updated order data
  const handleSave = async () => {
    if (!trackCode || !orderData) {
      alert('Невозможно сохранить. Данные отсутствуют.');
      return;
    }

    try {
      await axios.put(`${API}/api/orders/edit/${trackCode}`, orderData);
      alert('Данные успешно сохранены!');
      navigate('/clients');
    } catch (err: any) {
      console.error('Ошибка сохранения данных:', err.message);
      alert('Ошибка сохранения данных. Попробуйте снова.');
    }
  };

  // Update local state on input change
  const handleChange = (field: keyof OrderData, value: string | boolean) => {
    if (orderData) {
      setOrderData({ ...orderData, [field]: value });
    }
  };

  // Loading state
  if (loading) return <p>Загрузка данных...</p>;

  // Error handling
  if (error) return <p className="text-red-500">{error}</p>;

  // If no data found
  if (!orderData) return <p className="text-gray-500">Данные не найдены.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold text-center mb-5">Редактировать клиента</h1>
      <div className="space-y-4">
        {[{ label: 'Телефон', field: 'phone', type: 'text' },
          { label: 'Имя', field: 'firstName', type: 'text' },
          { label: 'Фамилия', field: 'lastName', type: 'text' },
          { label: 'Код', field: 'code', type: 'text' },
          { label: 'Пароль', field: 'password', type: 'password' }]
          .map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                value={orderData[field as keyof OrderData] || ''}
                onChange={(e) => handleChange(field as keyof OrderData, e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-blue-500"
              />
            </div>
          ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">Активен</label>
          <input
            type="checkbox"
            checked={orderData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-500 focus:ring focus:ring-blue-300"
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
