import React, { useState, useEffect, useCallback } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";

interface Order {
  trackCode: string;
  name: string;
  price: number;
  deliverTo: string;
  clientId: string;
  createdDate: string;
}

interface OrderListProps {
  orders: Order[];
  onDeleteOrder: (trackCode: string) => Promise<void>;
  onUpdateOrder: (updatedOrder: Order) => void;
}

const HistoryPage: React.FC<OrderListProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ open: boolean; order: Order | null; mode: 'view' | 'edit' }>({
    open: false,
    order: null,
    mode: 'edit',  // Default to edit mode
  });
  const [clientId] = useState(localStorage.getItem("clientId") || "");
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
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
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const openModal = (order: Order, mode: 'view' | 'edit') => {
    setModalState({ open: true, order, mode });
  };
  const closeModal = () => setModalState({ open: false, order: null });

  const handleOrderChange = (field: keyof Order, value: any) => {
    if (modalState.order) {
      setModalState({ ...modalState, order: { ...modalState.order, [field]: value } });
    }
  };

  const updateOrder = async () => {
    if (!modalState.order || !clientId) {
      setError("Client ID is missing or no order selected.");
      return;
    }

    try {
      const { trackCode } = modalState.order;
      const response = await API.put(`/api/orders/edit/${trackCode}`, modalState.order, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.trackCode === trackCode ? { ...order, ...modalState.order } : order
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

  const deleteOrder = async (trackCode: string) => {
    if (!clientId || !trackCode) {
      setError("Отсутствует идентификатор клиента");
      console.error("Не указан clientId для заказа:", trackCode, clientId);
      return;
    }

    try {
      if (!window.confirm("Вы уверены, что хотите удалить этот заказ?")) return;

      await API.delete(`/api/orders/delete/${trackCode}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(orders.filter((order) => order.trackCode !== trackCode));
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении заказа");
      console.error("Ошибка при удалении заказа:", err);
    }
  };

  const handleBack = () => navigate(-1); // Go back to the previous page

  return (
    <div className="min-h-screen p-8 container md:mx-auto">
      <nav className="text-sm mb-4">
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

      <button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">
        Назад
      </button>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
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
                <th className="px-4 py-2 border-b">Город</th>
                <th className="px-4 py-2 border-b">Дата создания</th>
                <th className="px-4 py-2 border-b">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
               <tr key={`${order.trackCode}-${index}`}>
                  <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                  <td className="px-4 py-2 border-b text-center">{order.name}</td>
                  <td className="px-4 py-2 border-b text-center">{order.trackCode}</td>
                  <td className="px-4 py-2 border-b text-center">{order.deliverTo}</td>
                  <td className="px-4 py-2 border-b text-center">{new Date(order.createdDate).toLocaleDateString()}</td>
                  <td className="px-1 py-2 border-b text-center justify-center gap-5 flex">
                  <button onClick={() => openModal(order, 'edit')} className="text-white rounded-md">
  ✏️
</button>

                    <button onClick={() => deleteOrder(order.trackCode)} className="text-red-500 hover:text-red-700" title="Удалить заказ">
                      🗑️
                    </button>

                    <button onClick={() => openModal(order, 'view')} className="text-red-500 hover:text-red-700" title="Подробнее">
  📜
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{modalState.open && modalState.order && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
    <div className="bg-white p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-semibold mb-4">{modalState.mode === 'edit' ? 'Редактировать заказ' : 'Подробнее'}</h2>
      <div className="space-y-4">
        <div>
          <label>Название</label>
          <input
            type="text"
            value={modalState.order.name}
            onChange={(e) => handleOrderChange("name", e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            readOnly={modalState.mode === 'view'}
          />
        </div>

        <div>
          <label>Трек-код</label>
          <input
            type="text"
            value={modalState.order.trackCode}
            onChange={(e) => handleOrderChange("trackCode", e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            readOnly={modalState.mode === 'view'}
          />
        </div>

        <div>
          <label>Цена</label>
          <input
            type="number"
            value={modalState.order.price}
            onChange={(e) => handleOrderChange("price", e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            readOnly={modalState.mode === 'view'}
          />
        </div>

        <div>
          <label>Город</label>
          <input
            type="text"
            value={modalState.order.deliverTo}
            onChange={(e) => handleOrderChange("deliverTo", e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            readOnly={modalState.mode === 'view'}
          />
        </div>

        <div>
          <label>Дата создания</label>
          <input
            type="text"
            value={new Date(modalState.order.createdDate).toLocaleDateString()}
            readOnly
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        {modalState.mode === 'edit' && (
          <button onClick={updateOrder} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Сохранить изменения
          </button>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default HistoryPage;
