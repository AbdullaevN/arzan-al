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
  clientData?: any;  

}

export const OrderList: React.FC<OrderListProps> = ({ orders, onDeleteOrder, clientData }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");



  // console.log(clientData,'OOO');
  
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

  //  console.log(filteredOrders,clientData);
   

  return (
    <div className="order-list p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.trackCode}  
              className="bg-white shadow-md rounded-lg border border-gray-200 relative w-full  md:text-sm text-sm overflow-hidden"
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

              <div className="p-3 md:p-6 text-sm">
                {/* <p className="text-sm text-gray-600 mb-2 py-5">
                  Дата: {new Date(order.createdDate).toLocaleDateString('ru-RU')}
                </p> */}

                <h4>{order.description}</h4>

                <div className="space-y-2 ">
                


                <div className="flex items-center">
  <label className="checkbox-container flex items-center text-lg cursor-pointer md:flex-row flex-col ">
    <span className="mr-2 flex flex-row gap-2 text-sm md:text-base">Дата регистрации </span>
    <input
      type="checkbox"
      readOnly
      checked={!!clientData?.deliveredDate} // Using optional chaining to safely access deliveredDate
      className="opacity-0 absolute"
    />
    <span className="checkmark"> <br />
    </span> 
    <span className=" text-gray-500 flex text-xs md:text-sm"> 
      {clientData?.deliveredDate ? new Date(clientData.deliveredDate).toLocaleString() : 'Дата не указана'}
    </span>
  </label>
</div>

<div className="flex items-center">
  <label className="checkbox-container flex items-center text-lg cursor-pointer md:flex-row flex-col ">
    <span className="mr-2 flex flex-row gap-2 text-sm md:text-base">Склад в <h3>{clientData?.city || 'Не указано'}</h3> </span>
    <input
      type="checkbox"
      readOnly
      checked={!!clientData?.deliveredDate} // Again using optional chaining
      className="opacity-0 absolute"
    />
    <span className="checkmark"> <br />
    </span> 
    <span className=" text-gray-500 flex text-xs md:text-sm"> 
      {clientData?.deliveredDate ? new Date(clientData.deliveredDate).toLocaleString() : 'Дата не указана'}
    </span>
  </label>
</div>


                  <div className="flex items-center">
  <label className="checkbox-container flex items-center text-lg cursor-pointer">
    <span className="mr-2 text-sm md:text-base">Выдан клиенту</span>
    <input
      type="checkbox"
      checked={clientData?.paid === true}
      readOnly
      className="opacity-0 absolute"
    />
    <span className="checkmark"></span>
  </label>
   {clientData?.paid && clientData?.dateOfPayment && (
    <span className="ml-4 text-gray-600 text-xs md:text-sm"> 
      {new Date(clientData.dateOfPayment).toLocaleDateString("ru-RU")}
    </span>
  )}
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
