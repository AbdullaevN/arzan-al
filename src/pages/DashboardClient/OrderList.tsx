import { useEffect, useState } from "react";
import { API } from "../../constants/api";
import { EditOrderModal } from "./EditItemModal";

interface Order {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
  weight?: number;
  amount?: number;
  trackCode: string;
}

interface OrderListProps {
  orders: Order[];
  onDeleteOrder: (trackCode: string) => Promise<void>;
  onUpdateOrder: (updatedOrder: Order) => void; // Добавляем функцию для обновления заказа
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onDeleteOrder, onUpdateOrder }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Reset filtered orders when the `orders` prop changes
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const response = await API.get(`/api/orders/search/${searchTerm}`);
        console.log("API Response:", response.data);

        if (response.data && typeof response.data === 'object') {
          setFilteredOrders([response.data]); // Single result wrapped in an array
        } else if (Array.isArray(response.data)) {
          setFilteredOrders(response.data); // Multiple results
        } else {
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Ошибка при поиске:", error);
        setFilteredOrders([]);
      }
    } else {
      setFilteredOrders(orders);
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="order-list p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      <div className="mt-4 mb-4 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="w-1/5 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Поиск
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {filteredOrders.length > 0 ? (
    filteredOrders.map((order) => (
      <div
        key={order.trackCode}  
        className="bg-white shadow-md rounded-lg border border-gray-200 relative max-w-sm overflow-hidden"
      >
        <div className="flex justify-between bg-orange-400 py-2 px-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Заказ № {order.trackCode}</h3>
          <h3 className="text-lg font-semibold">Имя: {order.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(order)}
              className="text-blue-500 hover:text-blue-700"
              title="Редактировать заказ"
            >
              ✏️
            </button>
            <button
  onClick={() => {
    if (!order.trackCode || !order.clientId) {
      console.error('trackCode или clientId не найдены для заказа:', order);
      return;
    }
    onDeleteOrder(order.trackCode, order.clientId);  // Pass clientId here
  }}
  className="text-red-500 hover:text-red-700"
  title="Удалить заказ"
>
  🗑️
</button>

          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2 py-5">
            Дата регистрации: {new Date(order.createdDate).toLocaleDateString('ru-RU')}
          </p>

          <h4>{order.description}</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <label className="checkbox-container flex items-center text-lg cursor-pointer">
                <span className="mr-2">Склад в Китае</span>
                <input
                  type="checkbox"
                  checked={order.warehouseChina}
                  readOnly
                  className="opacity-0 absolute"
                />
                <span className="checkmark"></span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="checkbox-container flex items-center text-lg cursor-pointer">
                <span className="mr-2">Токмок - склад в Бишкеке</span>
                <input
                  type="checkbox"
                  checked={order.warehouseTokmok}
                  readOnly
                  className="opacity-0 absolute"
                />
                <span className="checkmark"></span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="checkbox-container flex items-center text-lg cursor-pointer">
                <span className="mr-2">Выдан клиенту</span>
                <input
                  type="checkbox"
                  checked={order.deliveredToClient}
                  readOnly
                  className="opacity-0 absolute"
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>Нет заказов, удовлетворяющих запросу.</p>
  )}
</div>


      {isModalOpen && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={closeModal}
          onSave={onUpdateOrder} // Передаем функцию для обновления
        />
      )}
    </div>
  );
};
