import { useEffect, useState } from "react";
import { API } from "../../constants/api";

interface Order {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  receiventInChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
  weight?: number;
  amount?: number;
  trackCode: string;
  clientId: string;
  isssurdm?: boolean;  // Добавляем свойство isssurdm
}

interface OrderListProps {
  orders: Order[];
  onDeleteOrder: (trackCode: string, clientId: string) => Promise<void>;
  clientData?: any; // или конкретный интерфейс клиента

}

export const OrderList: React.FC<OrderListProps> = ({ orders, onDeleteOrder, clientData }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");



  // console.log(fetchClient,'OOO');
  
  // Reset filtered orders when the `orders` prop changes



 
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
  // console.log(filteredOrders);
  

  useEffect(() => {
    setFilteredOrders(orders);
   }, [orders]);

  return (
    <div className="order-list p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

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
                  Дата: {new Date(order.createdDate).toLocaleDateString('ru-RU')}
                </p>

                <h4>{order.description}</h4>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="checkbox-container flex items-center text-lg cursor-pointer">
                      <span className="mr-2">Склад в Китае</span>
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="opacity-0 absolute"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="checkbox-container flex items-center text-lg cursor-pointer flex-col">
                      <span className="mr-2 flex gap-3 w-full">Склад в<h3>{clientData.city}</h3> </span>
                      <input
                        type="checkbox"
                        readOnly
                        checked={order.deliveredToClient === true}
                        className="opacity-0 absolute"
                      />
                      <span className="checkmark"> <br />
                      </span> 
                      <span> {new Date(order.createdDate).toLocaleString()}</span>

                      {/* <p>Текущее время: {new Date(Date.now()).toLocaleString()}</p> */}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="checkbox-container flex items-center text-lg cursor-pointer">
                      <span className="mr-2">Выдан клиенту</span>
                      <input
                        type="checkbox"
                        checked={order.issued === true }
                        readOnly
                        className="opacity-0 absolute"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  {/* Добавляем проверку для isssurdm */}
                  {order.isssurdm && (
                    <div className="flex items-center">
                      <label className="checkbox-container flex items-center text-lg cursor-pointer">
                        <span className="mr-2">Поставлен</span>
                        <input
                          type="checkbox"
                          checked={true}  // Галочка будет установлена
                          readOnly
                          className="opacity-0 absolute"
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  )}
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
