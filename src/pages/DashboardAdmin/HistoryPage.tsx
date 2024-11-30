import React, { useState, useEffect } from "react";
import { API } from "../../constants/api";
 import { useNavigate } from "react-router-dom";




interface OrderListProps {
  orders: Order[];
  onDeleteOrder: (trackCode: string) => Promise<void>;
  onUpdateOrder: (updatedOrder: Order) => void; // Добавляем функцию для обновления заказа
}

const HistoryPage: React.FC<OrderListProps> = ({onDeleteOrder}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

 
  


  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/api/orders/allOrders");
      const filteredOrders = response.data.filter((order: Order) =>
        order.trackCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setOrders(filteredOrders);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить заказы");
      console.error("Ошибка загрузки заказов:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderChange = (field: keyof Order, value: any) => {
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, [field]: value });
    }
  };

  const updateOrder = async () => {
    if (!selectedOrder || !clientId) {
      setError("Client ID is missing or no order selected.");
      return;
    }

    const { trackCode } = selectedOrder;

    try {
      // const updatedOrder = { ...selectedOrder, clientId };
       // Add clientId to the order

       console.log(selectedOrder,'SSSSSSSS');
       
      const response = await API.put(`/api/orders/edit/${trackCode}`, selectedOrder, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.trackCode === trackCode ? { ...order, ...selectedOrder } : order
          )
        );
        closeModal();
      } else {
        setError("Failed to update order.");
      }
    } catch (err: any) {
      setError("Error updating order: " + (err.message || "Unknown error"));
      console.error("Update order error:", err);
    }
  };




  const deleteOrder = async (trackCode: string, clientId: string) => {

   
    if (!clientId || !trackCode) {
      setError('Отсутствует идентификатор клиента');
      console.error('Не указан clientId для заказа:', trackCode, clientId);
      return;
    }
  
    try {
      if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;
  
      console.log('Попытка удалить заказ:', trackCode, 'для клиента:', clientId);
      await API.delete(`/api/orders/delete/${trackCode}/${clientId}`, {
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
  const handleOrderDetails = (trackCode: string) => {
    navigate(`/details/${trackCode}`);
  };


  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen  p-8 container md:mx-auto ">
      <nav className="text-sm mb-4 ">
        <ol className="list-reset flex text-gray-500 text-lg">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">
              Главная
            </a>
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

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Поиск по трек-коду"
        className="px-4 py-2 border rounded w-full mb-4"
      />

      {loading && <p>Загрузка заказов...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">№</th>
                <th className="px-4 py-2 border-b">Название</th>
                <th className="px-4 py-2 border-b">Трек-код</th>
                {/* <th className="px-4 py-2 border-b">Количество</th> */}
                {/* <th className="px-4 py-2 border-b">Цена</th> */}
                <th className="px-4 py-2 border-b">Дата создания</th>
                {/* <th className="px-4 py-2 border-b">Оплачено</th> */}
                <th className="px-4 py-2 border-b">Действия</th>
              
                
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.trackCode}>
                  <td className="px-4 py-2 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {order.name}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {order.trackCode}
                  </td>

                  <td className="px-4 py-2 border-b text-center">
                    {new Date(order.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-1 py-2 border-b text-center justify-center gap-5 flex">
                    <button
                      className="   text-white rounded-md"
                      onClick={() => openModal(order)}
                    >
                      ✏️
                    </button>


                    <button
                      onClick={() => {
                        if (!order.trackCode || !order.clientId) {
                          console.error(
                            "trackCode или clientId не найдены для заказа:",
                            order
                          );
                          return;
                        }
                        deleteOrder(order.trackCode, order.clientId); // Pass clientId here
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Удалить заказ"
                    >
                      🗑️
                    </button>



                    <button
  onClick={() => navigate(`/details/${order.trackCode}`)} // Перенаправление на страницу деталей
  className="text-red-500 hover:text-red-700"
                      title="Подробнее"
                    >
                      📜
                    </button>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Редактировать заказ</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Название
              </label>
              <input
                type="text"
                value={selectedOrder.name}
                onChange={(e) => handleOrderChange("name", e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Цена
              </label>
              <input
                type="number"
                value={selectedOrder.price}
                onChange={(e) => handleOrderChange("price", e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Отмена
              </button>
              <button
                onClick={updateOrder}
                className="px-4 py-2 bg-blue-500 text-white rounded"
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
