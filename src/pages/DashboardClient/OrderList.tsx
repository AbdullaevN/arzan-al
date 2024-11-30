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
  clientId: string;  

}
interface OrderListProps {
  orders: Order[];
  onDeleteOrder: (trackCode: string, clientId: string) => Promise<void>;
}


export const OrderList: React.FC<OrderListProps> = ({ orders, onDeleteOrder }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
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

 

  return (
    <div className="order-list p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      <div className="flex gap-4 mb-4">
        <input
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
          placeholder="Поиск"
        />
        <button 
         onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
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
        <div className="flex justify-between bg-orange-400 py-2 px-4 rounded-t-lg flex-col">
          <h3 className="text-lg font-semibold">Заказ № {order.trackCode}</h3>
          <div className="flex space-x-2">
          <h3 className="text-lg font-semibold">Описание: {order.name}</h3>
          
            <button
  // onClick={() => {
  //   if (!order.trackCode || !order.clientId) {
  //     console.error('trackCode или clientId не найдены для заказа:', order);
  //     return;
  //   }
  //   onDeleteOrder(order.trackCode, order.clientId);  // Pass clientId here
  // }}

  onClick={() => onDeleteOrder(order.trackCode, order.clientId)} 

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

 
    </div>
  );
};
