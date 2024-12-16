import React, { useState, useEffect } from 'react';
import { API } from '../../constants/api';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  description: string;
  createdAt: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
  issued: boolean;  
  paid: boolean
}

export const Archive = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]); // State for displayed orders


  const navigate = useNavigate();

  // Fetch data from the API
  const fetchHistory = async () => {
    try {
      const res = await API.get('/api/orders/history');
      const completedOrders = res.data.filter((order: Order) => order.paid === true);
      setOrders(completedOrders);
      setDisplayedOrders(completedOrders); // Set initial display orders
      console.log(completedOrders, 'completed orders');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    setDisplayedOrders(updatedOrders); // Update displayed orders as well
  };

  // Update search term on input change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Execute search on button click
  const performSearch = () => {
    const filteredOrders = orders.filter((order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedOrders(filteredOrders); // Update displayed orders based on search
  };


  const handleBack = () => {
    navigate(-1);  
  };

  console.log(displayedOrders);
  

  return (
    <div className="order-list p-4 container md:mx-auto flex flex-col items-start">
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
          <li>Архив</li>
        </ol>
      </nav>


      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Назад
      </button>


      <h2 className="text-2xl font-bold mb-4">Ваши заказы</h2>

      {/* Поиск по заказам */}
      {/* <div className="mt-4 mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Поиск по коду заказа"
          value={searchTerm}
          onChange={handleSearchInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={performSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Искать
        </button>
      </div> */}

<div className=" flex justify-center flex-wrap items-center gap-10">
  {displayedOrders.map((order) => (
    <div
      key={order._id}
      className="bg-white shadow-md p-4  sm:p-4 rounded-lg border border-gray-200 relative overflow-hidden"
    >
      {/* Название заказа */}
      <div className="flex justify-between mb-2">
        <h3 className="text-base sm:text-lg font-semibold">
          Заказ: {order.name}
        </h3>
        {/* <button
          onClick={() => deleteOrder(order._id)}
          className="text-red-500 hover:text-red-700"
          title="Удалить заказ"
        >
          🗑️
        </button> */}
      </div>

      {/* Основная информация */}
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-semibold">Трек-код:</span> {order.trackCode}</p>
        <p><span className="font-semibold">Клиент:</span> {order.clientId}</p>
        <p><span className="font-semibold">Адрес доставки:</span> {order.deliverTo}</p>
        <p><span className="font-semibold">Вес:</span> {order.weight} кг</p>
        <p><span className="font-semibold">Цена:</span> {order.price} сом</p>
        <p><span className="font-semibold">Сумма:</span> {order.amount} </p>
        <p>
          <span className="font-semibold">Оплачено:</span>{" "}
          {order.paid ? "Да" : "Нет"}
        </p>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-2 text-sm text-gray-500">
        <p><span className="font-semibold">Дата создания:</span> {new Date(order.createdDate).toLocaleDateString()}</p>
        <p><span className="font-semibold">Дата оплаты:</span> {order.dateOfPayment ? new Date(order.dateOfPayment).toLocaleDateString() : "Нет данных"}</p>
        {/* <p>
          <span className="font-semibold">Выдано клиенту:</span>{" "}
          {order.issued ? "Да" : "Нет"}
        </p>
        <p>
          <span className="font-semibold">Получено в Китае:</span>{" "}
          {order.receiventInChina ? "Да" : "Нет"}
        </p> */}
      </div>
    </div>
  ))}
</div>


    </div>
  );
};
