import { useEffect, useState } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";

const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const navigate = useNavigate();

  const fetchOrders = () => {
    API.get('/api/orders/allOrders')
      .then((response) => {
        // Filter the orders based on the search term if it's provided
        const filteredOrders = response.data.filter((order: Order) =>
          order.trackCode.includes(searchTerm)
        );
        setOrders(filteredOrders);
      })
      .catch((error) => console.error('Ошибка загрузки заказов:', error));
  };
  

  // const handleDelete = async (trackCode: string) => {
  //   if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
  //     try {
  //       await API.delete(`/api/orders/delete/${trackCode}`);
  //       // Filter out the deleted order locally without fetching again
  //       setOrders((prevOrders) => prevOrders.filter((order) => order.trackCode !== trackCode));
  //       console.log('Order deleted successfully');
  //     } catch (error) {
  //       console.error('Ошибка при удалении заказа:', error);
  //       alert('Не удалось удалить заказ. Попробуйте снова.');
  //     }
  //   }
  // };

  const deleteOrder = async (trackCode: string) => {
    try {
      // Ваш запрос на удаление
      const response = await API.delete(`/api/orders/delete/${trackCode}`);
      console.log('Удален заказ:', response);

      // Обновляем список заказов
      const updatedOrders = orders.filter(order => order.trackCode !== trackCode);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error);
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, []);

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
          <li>Клиенты</li>
        </ol>
      </nav>
      <div className="mb-8 flex space-x-2">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Поиск по трек-коду"
    className="px-4 py-2 border rounded w-full"
  />
  <button
    onClick={() => fetchOrders()}  // Optionally filter or trigger search
    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
  >
    Поиск
  </button>
</div>

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
                    onClick={() => navigate(`/edit/${order.id}`)}
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
    </div>
  );
};

export default HistoryPage;
