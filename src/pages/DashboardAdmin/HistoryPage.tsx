import { useEffect, useState } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";
 
const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const navigate = useNavigate();

  // const fetchClients = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const headers = {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     };
  //     const response = await API.get('/api/orders/allClients', { headers });
  //     console.log(response.data, 'response');
  
  //     const clientIds = response.data.map((client) => client.clientId);
  //     setClients(clientIds);
  
  //   } catch (err: any) {
  //     setError(err.message || 'Не удалось загрузить список клиентов');
  //     console.error('Ошибка загрузки клиентов:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // Fetch Orders
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

  // Delete Order
  const deleteOrder = async (trackCode: string, clientId: string) => {
    try {
      if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;
  
      const response = await API.delete(`/api/orders/delete/${trackCode}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 200) {
        setOrders(prevOrders => prevOrders.filter(order => order.trackCode !== trackCode));
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении заказа');
      console.error('Ошибка при удалении заказа:', err);
    }
  };

  // Open Modal
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Update Order
  const updateOrder = async () => {
    if (!selectedOrder) return;
    const { trackCode, clientId, name, price } = selectedOrder;

    try {
      await API.put(`/api/orders/edit/${trackCode}`, {selectedOrder}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setOrders(orders.map(order => (order.trackCode === trackCode ? selectedOrder : order)));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении заказа');
      console.error('Ошибка при обновлении заказа:', err);
    }
  };

  // Fetch clients and orders when the component is mounted or search term changes
  useEffect(() => {
    // fetchClients();
    fetchOrders();
  }, [searchTerm]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };


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
      
       {/* Кнопка "Назад" */}
       <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Назад
      </button>


      <div className="mb-8 flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по трек-коду"
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {loading && <p className="text-blue-500">Загрузка заказов...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
                <th className="px-4 py-2 border-b">ID клиента</th>
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
                  <td className="px-4 py-2 border-b text-center">{order.clientId}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {/* <button
                      className="px-3 py-1 mr-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                      onClick={() => openModal(order)}
                    >
                      Изменить
                    </button> */}
                    <button
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                      onClick={() => deleteOrder(order.trackCode, order.clientId)}
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

      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Редактирование заказа</h2>
            <div>
              <label className="block mb-2">Название:</label>
              <input
                type="text"
                value={selectedOrder.name}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Цена:</label>
              <input
                type="text"
                value={selectedOrder.price}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Закрыть
              </button>
              <button
                onClick={updateOrder}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
