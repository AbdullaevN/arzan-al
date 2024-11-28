import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../../constants/api';
 
const OrderDetailsPage: React.FC = () => {
  const { trackCode } = useParams<{ trackCode: string }>(); // Получаем trackCode из URL
  const [orderDetails, setOrderDetails] = useState<Order | null>(null); // Храним детали заказа
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

 console.log("trackCode из URL:", trackCode);

  // Функция для получения данных заказа
  const fetchOrderDetails = async () => {
    if (!trackCode) {
      setError("Некорректный трек код");
      return;
    }
  
    console.log("Запрос к API с трек кодом:", trackCode); // Логируем trackCode для проверки
  
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/api/orders/${trackCode}`);
      setOrderDetails(response.data);
    } catch (err: any) {
      setError(`Не удалось загрузить данные заказа: ${err.message}`);
      console.error("Ошибка загрузки данных заказа:", err);
      if (err.response) {
        // Если сервер вернул ответ с ошибкой
        console.error("Ответ сервера:", err.response);
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchOrderDetails(); // Загружаем данные при монтировании компонента
  }, [trackCode]); // Перезапускаем запрос при изменении trackCode в URL

  if (loading) return <p>Загрузка данных заказа...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
          <li>Детали заказа #{trackCode}</li>
        </ol>
      </nav>

      {/* Детали заказа */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Детали заказа #{trackCode}</h2>
        
        {orderDetails && (
          <>
            <p className="mb-2"><strong>Трек код:</strong> {orderDetails.trackCode}</p>
            <p className="mb-2"><strong>Создан в:</strong> {new Date(orderDetails.createdDate).toLocaleDateString()}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold">История:</h3>
              <ul className="list-disc pl-5">
                {orderDetails.history.map((event, index) => (
                  <li key={index}>
                    {event.location}: {event.route} в {new Date(event.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mb-2"><strong>Выдан:</strong> {orderDetails.issued}</p>
            <p><strong>Отслеживает трек:</strong> {orderDetails.trackingStatus}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
