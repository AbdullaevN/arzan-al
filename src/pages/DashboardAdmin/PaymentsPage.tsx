import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../constants/api";
 

type Order = {
  trackCode: string;
  clientCode: string;
  quantity: number;
  paid: boolean;
};
 
const PaymentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPaid, setIsPaid] = useState(false);


  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


  const navigate = useNavigate();


  const toggleModal = (order: Order | null) => {
    setSelectedOrder(order);
    setIsModalOpen(!isModalOpen);
  };
  

 
   // Загрузка заказов с сервера
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


 
  // Функция обработки оплаты
  const handlePayOrder = async () => {
    if (selectedOrder && isPaid) { // Проверяем, что галочка установлена
      try {
        // Создаем обновленный объект заказа, включая вес
        const updatedOrder = { ...selectedOrder, paid: true };
  
        // Отправляем PUT-запрос на сервер
        const response = await API.put(
          `/api/orders/edit/${selectedOrder.trackCode}`, // URL с trackCode
          updatedOrder // Отправляем данные с обновленным полем paid
        );
  
        // Обработка ответа от сервера
        if (response.status === 200) {
          console.log('Заказ успешно обновлен:', response.data);
          
          // Закрытие модального окна
          toggleModal(null);
  
          // Обновляем список заказов (если нужно)
          setOrders((prevOrders) =>
            prevOrders.map(order =>
              order._id === updatedOrder._id ? updatedOrder : order
            )
          );
        } else {
          console.error('Ошибка при обновлении заказа');
        }
      } catch (error) {
        console.error('Ошибка запроса:', error);
      }
    } else {
      console.log('Необходимо подтвердить оплату');
    }
  };
  
  
  
  
  


    // Загрузка заказов при изменении поискового термина
    useEffect(() => {
      fetchOrders();
    }, [searchTerm]);


    const handleDeleteOrder = async (orderId: string) => {
      try {
        await API.delete(`/api/orders/${orderId}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } catch (err) {
        console.error('Ошибка при удалении заказа:', err);
      }
    };
    

    console.log(selectedOrder, 'list');
    


    const handleBack = () => {
      navigate(-1); // Go back to the previous page
    };

  return (
  <div className="bg-image min-h-screen">
      <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <ol className="list-reset flex text-gray-500">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">
            Главная
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Оплата</li>
        </ol>
      </nav>

      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Назад
      </button>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
         
       <Link to={'/unpaid'}>

        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
          Неоплаченные
        </button>
       </Link>

      <Link to={'/paid'}>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Оплаченные
        </button>
      </Link>
      </div>

      

      {/* Search */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
          placeholder="Поиск"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Поиск
        </button>
      </div>

      {/* Recent Dates - Scrollable */}
      <div className="flex gap-2 overflow-x-auto mb-4 p-2 border-b">
        {[
          "2024-10-14", "2024-10-16", "2024-10-17", "2024-10-18", "2024-10-19",
          "2024-10-21", "2024-10-22", "2024-10-24", "2024-10-26", "2024-10-29",
          "2024-10-30", "2024-11-02", "2024-11-05", "2024-11-07"
        ].map((date) => (
          <button
            key={date}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            {date}
          </button>
        ))}
      </div>

      {/* Download Button and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">
          --
        </button>
        {/* <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          + Добавить
        </button> */}
       </div>


       {isModalOpen && selectedOrder && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Оплата заказа</h2>

      {/* Форма */}
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Код товара</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedOrder.trackCode}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Доставить в</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedOrder.deliverTo}
            readOnly
          />
        </div>

        {/* Редактируемое поле для веса */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Вес (кг)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedOrder.weight}
            onChange={(e) => {
              const updatedOrder = { ...selectedOrder, weight: e.target.value };
              setSelectedOrder(updatedOrder); // Обновляем состояние выбранного заказа
            }}
          />
        </div>

        {/* Цена (из localStorage) */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedOrder.price}
            readOnly
          />
        </div> */}

        {/* Вычисление итоговой суммы */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Итоговая сумма</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedOrder.weight * (parseFloat(localStorage.getItem("price")) || selectedOrder.price)}
            readOnly
          />
        </div>

        {/* Добавление чекбокса для подтверждения оплаты */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isPaid} // Статус чекбокса зависит от состояния
              onChange={() => setIsPaid(!isPaid)} // Изменение состояния чекбокса
            />
            Подтверждаю оплату
          </label>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg"
            onClick={() => toggleModal(null)}
          >
            Отмена
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handlePayOrder}
            disabled={!isPaid} // Отключаем кнопку, если галочка не установлена
          >
            Оплатить
          </button>
        </div>
      </form>
    </div>
  </div>
)}





      {/* Payment Table */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-md mb-6 overflow-x-auto">
        <table className="min-w-full bg-white">
        <thead>
    <tr>
      {["№", "Дата оплаты", "Код", "ФИ", "Оплатил?", "Сумма", "Вес", "Кол-во", "Действие"].map((header) => (
        <th key={header} className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
          {header}
        </th>
      ))}
    </tr>
  </thead>
          <tbody>
  {loading ? (
    <tr>
      <td colSpan={9} className="py-3 px-4 text-center text-gray-500">
        Загрузка...
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan={9} className="py-3 px-4 text-center text-red-500">
        {error}
      </td>
    </tr>
  ) : orders.length > 0 ? (
    orders.map((order, idx) => (
      <tr key={order.id}>
        <td className="py-3 px-4 border-b text-gray-700">{idx + 1}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.paymentDate || '—'}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.trackCode}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.fullName}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.isPaid ? 'Да' : 'Нет'}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.totalAmount} сом</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.totalWeight} кг</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.totalQuantity}</td>
        <td className="py-3 px-4 border-b text-gray-700">
  <button
    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
    onClick={() => toggleModal(order)}
  >
    Оплатить
  </button>
</td>

        
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={9} className="py-3 px-4 text-center text-gray-500">
        Нет данных
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* Summary Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clients Count */}
        <div className="p-4 bg-blue-100 rounded-lg">
          <div className="text-sm text-gray-700">Кол-во клиентов: 0 шт</div>
          <div className="text-sm text-gray-700">Оплатил: 0 шт</div>
          <div className="text-sm text-gray-700">Осталось: 0 шт</div>
        </div>
        {/* Total Amount */}
        <div className="p-4 bg-green-100 rounded-lg">
          <div className="text-sm text-gray-700">Общая сумма: 0 сом</div>
          <div className="text-sm text-gray-700">Оплатил: 0 сом</div>
          <div className="text-sm text-gray-700">Осталось: 0 сом</div>
        </div>
        {/* Total Weight */}
        <div className="p-4 bg-yellow-100 rounded-lg">
          <div className="text-sm text-gray-700">Общий вес: 0.00 кг</div>
          <div className="text-sm text-gray-700">Оплатил за: 0.00 кг</div>
          <div className="text-sm text-gray-700">Осталось: 0.00 кг</div>
        </div>
        {/* Product Count */}
        <div className="p-4 bg-red-100 rounded-lg">
          <div className="text-sm text-gray-700">Кол-во товаров: 0 шт</div>
          <div className="text-sm text-gray-700">Оплачено за: 0 шт</div>
          <div className="text-sm text-gray-700">Осталось: 0 шт</div>
        </div>
      </div>
    </div>

  </div>







  );
};

export default PaymentsPage;
