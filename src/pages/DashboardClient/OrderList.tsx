import { useEffect, useState } from "react";

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

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.trackCode.toLowerCase().includes(searchTerm) ||
        order.description?.toLowerCase().includes(searchTerm)
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="order-list p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
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

            <div className='p-6'>
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
        ))}
      </div>
    </div>
  );
};
