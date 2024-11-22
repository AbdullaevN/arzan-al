import { useEffect, useState } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";

const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

    // Загрузка заказов с сервера
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await API.get('/api/orders/allOrders');
        const filteredOrders = response.data.filter((order: Order) =>
          order.trackCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setOrders(filteredOrders);
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить заказы');
        console.error('Ошибка загрузки заказов:', err);
      } finally {
        setLoading(false);
      }
    };

  // Удаление заказа
  const deleteOrder = async (trackCode: string) => {
    try {
      if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;

      console.log('Попытка удалить заказ:', trackCode);
      await API.delete(`/api/orders/delete/${trackCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      setOrders(orders.filter(order => order.trackCode !== trackCode));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении заказа');
      console.error('Ошибка при удалении заказа:', err);
    }
  };

  // Загрузка заказов при изменении поискового термина
  useEffect(() => {
    fetchOrders();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <nav className="text-sm mb-4">
        <ol className="list-reset flex text-gray-500">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">Главная</a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Заказы</li>
        </ol>
      </nav>

      {/* Поисковая панель */}
      <div className="mb-8 flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по трек-коду"
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* Отображение загрузки и ошибок */}
      {loading && <p className="text-blue-500">Загрузка заказов...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Таблица заказов */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">№</th>
                <th className="px-4 py-2 border-b">Название</th>
                <th className="px-4 py-2 border-b">Количество</th>
                <th className="px-4 py-2 border-b">Цена</th>
                <th className="px-4 py-2 border-b">Дата создания</th>
                <th className="px-4 py-2 border-b">Трек-код</th>
                <th className="px-4 py-2 border-b">Статус оплаты</th>
                <th className="px-4 py-2 border-b">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                  <td className="px-4 py-2 border-b text-center">{order.name}</td>
                  <td className="px-4 py-2 border-b text-center">{order.amount}</td>
                  <td className="px-4 py-2 border-b text-center">{order.price}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {new Date(order.createdDate * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b text-center">{order.trackCode}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {order.paid ? 'Оплачено' : 'Не оплачено'}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="px-3 py-1 mr-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                      onClick={() => navigate(`/edit/${order.trackCode}`)}
                    >
                      Изменить
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                      onClick={() => deleteOrder(order.trackCode)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
