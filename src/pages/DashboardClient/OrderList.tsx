import { useEffect, useState } from "react";
 import { API } from "../../constants/api";

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
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onDeleteOrder }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Reset filtered orders when the `orders` prop changes
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleSearch = async () => {
    // If search term is not empty, make the API call
    if (searchTerm) {
      try {
        const response = await API.get(`/api/orders/search/${searchTerm}`);
        console.log("API Response:", response.data);
  
        // Check if the response data is an object and wrap it in an array
        if (response.data && typeof response.data === 'object') {
          setFilteredOrders([response.data]); // Single result wrapped in an array
        } else if (Array.isArray(response.data)) {
          setFilteredOrders(response.data); // Multiple results
        } else {
          setFilteredOrders([]); // If response is neither an object nor an array, reset to empty
        }
      } catch (error) {
        console.error("Ошибка при поиске:", error);
        setFilteredOrders([]); // Handle errors by clearing the filtered orders
      }
    } else {
      // If search term is empty, show all orders
      setFilteredOrders(orders);
    }
  };

  return (
    <div className="order-list p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      <div className="mt-4 mb-4 flex justify-between items-center  gap-4">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className=" w-1/5 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Поиск
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Render orders if filteredOrders is not empty */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.trackCode}
              className="bg-white shadow-md rounded-lg border border-gray-200 relative max-w-sm overflow-hidden"
            >
              <div className="flex justify-between bg-orange-400 py-2 px-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Заказ № {order.trackCode}</h3>
                <h3 className="text-lg font-semibold">Имя: {order.name}</h3>
                <button
                  onClick={() => {
                    if (!order.trackCode) {
                      console.error('trackCode не найден для заказа:', order);
                      return;
                    }
                    onDeleteOrder(order.trackCode);
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Удалить заказ"
                >
                  🗑️
                </button>
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
    </div>
  );
};
