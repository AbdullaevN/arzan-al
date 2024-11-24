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

  // Fetch Clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/api/orders/allClients');
      setClients(response.data);
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить список клиентов');
      console.error('Ошибка загрузки клиентов:', err);
    } finally {
      setLoading(false);
    }
  };

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

      await API.delete(`/api/orders/delete/${trackCode}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Remove order from the local state
      setOrders(orders.filter(order => order.trackCode !== trackCode));
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
  const updateOrder = async (order: Order) => {
    try {
      await API.put(`/api/orders/edit/${order.trackCode}`, {
        ...order,
        clientId: order.clientId,  // Передаем clientId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Update the local state with the modified order
      setOrders(orders.map(o => (o.trackCode === order.trackCode ? order : o)));
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении заказа');
      console.error('Ошибка при обновлении заказа:', err);
    }
  };

  // Fetch clients and orders when the component is mounted or search term changes
  useEffect(() => {
    fetchClients();
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

      {/* Search Panel */}
      <div className="mb-8 flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по трек-коду"
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* Loading and Error Message */}
      {loading && <p className="text-blue-500">Загрузка заказов...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Orders Table */}
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
                      onClick={() => openModal(order)} // Open modal
                    >
                      Изменить
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                      onClick={() => deleteOrder(order.trackCode, order.clientId)} // Delete order
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

      {/* Edit Order Modal */}
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
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <label className="block mb-2">Цена:</label>
              <input
                type="number"
                value={selectedOrder.price}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, price: e.target.value })}
                className="w-full px-4 py-2 border rounded mb-4"
              />
              {/* Additional fields for order editing can go here */}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={closeModal} // Close modal
              >
                Отменить
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => selectedOrder && updateOrder(selectedOrder)} // Save changes
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
