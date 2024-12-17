import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../constants/api";
import usePriceStore from "../../store/useClient";

import * as XLSX from "xlsx"; 

 
interface OrderDetails {
  id: string;
  name: string;
  createdDate: string;
  price: number;
  weight: number;
  amount: number;
  dateOfPayment: number;
  deliveredDate: number;
  deliverTo: string;
  trackCode: string;
  issued: boolean;
  paid: boolean;
  receiventInChina: boolean;
  description?: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
}

interface Order {
  id: string;
  trackCode: string;
  name: string;
  price: number;
  weight: number;
  amount: number;
  paid: boolean;
  dateOfPayment?: number; // Поле может быть необязательным
}

interface AddItemModalProps {
  addNewOrder: (newOrder: OrderDetails) => void;
}

const PaymentsPage: React.FC<AddItemModalProps> = ({addNewOrder}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPaid, setIsPaid] = useState(false);

 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');


  const [trackCode, setTrackCode] = useState("");
  const [code, setCode] = useState("");

  const [weight, setWeight] = useState("");
  const [amount, setAmount] = useState("");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { price, fetchPrice } = usePriceStore();

  const [stats, setStats] = useState({
    clientsCount: 0,
    paidClients: 0,
    remainingClients: 0,
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    totalWeight: 0,
    paidWeight: 0,
    remainingWeight: 0,
    productCount: 0,
    paidProducts: 0,
    remainingProducts: 0,
  });

  // Функция для расчета статистики
  const calculateStatistics = () => {
    let clientsCount = 0;
    let paidClients = 0;
    let remainingClients = 0;

    let totalAmount = 0;
    let paidAmount = 0;
    let remainingAmount = 0;

    let totalWeight = 0;
    let paidWeight = 0;
    let remainingWeight = 0;

    let productCount = 0;
    let paidProducts = 0;
    let remainingProducts = 0;

    filterOrders.forEach((order) => {
      // Количество клиентов
      clientsCount++;
      if (order.paid) paidClients++;
      else remainingClients++;

      // Общая сумма
      totalAmount += order.price;
      if (order.paid) paidAmount += order.price;
      else remainingAmount += order.price;

      // Общий вес
      totalWeight += order.weight;
      if (order.paid) paidWeight += order.weight;
      else remainingWeight += order.weight;

      // Количество товаров
      productCount += order.amount;
      if (order.paid) paidProducts += order.amount;
      else remainingProducts += order.amount;
    });

    setStats({
      clientsCount,
      paidClients,
      remainingClients,
      totalAmount,
      paidAmount,
      remainingAmount,
      totalWeight,
      paidWeight,
      remainingWeight,
      productCount,
      paidProducts,
      remainingProducts,
    });
  };


 

  const uniquePaymentDates = Array.from(
    new Set(
      orders
        .filter((order) => order.dateOfPayment)  
        .map((order) =>
          new Date(order.dateOfPayment).toLocaleDateString("en-GB")  
        )
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); 
  


  const filterOrders = selectedDate
  ? orders.filter((order) =>
      new Date(order.dateOfPayment).toLocaleDateString("en-GB") === selectedDate
    )
  : orders;

 
   const navigate = useNavigate();


   const toggleModal = (order: Order | null) => {
    setSelectedOrder(order);
    setIsModalOpen(prevState => !prevState);
  };

 
   // Загрузка заказов с сервера
   const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await API.get('/api/orders/allClients');
      // const filteredOrders = response.data.filter((order: Order) =>
      //   order.trackCode.toLowerCase().includes(searchTerm.toLowerCase())
      // );
      setOrders(response.data);
      console.log(response.data, 'yyyyyyyyyyyyyy');
      
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить заказы');
      console.error('Ошибка загрузки заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log(filterOrders,'sdf');
  
 
    const handleBack = () => {
      navigate(-1); // Go back to the previous page
    };


    const handlePaid = async (selectedOrder: Order) => {
      if (!selectedOrder) {
        setError("Client ID is missing or no order selected.");
        return;
      }
    
      const { trackCode } = selectedOrder;
    
      // Подтверждение действия
      const isConfirmed = window.confirm(
        `Вы действительно хотите отметить заказ с трек-кодом "${trackCode}" как оплаченный?`
      );
    
      if (!isConfirmed) {
        return; // Прекращаем выполнение, если пользователь отменил действие
      }
    
      try {
        // Отправляем PUT-запрос для обновления заказа
        const response = await API.put(
          `/api/orders/edit-client`,
          {
            ...selectedOrder,
            paid: true,
            dateOfPayment: Date.now(), // Добавляем дату оплаты
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Авторизация через токен
            },
          }
        );
    
        if (response.status === 200) {
          // Если успешно, обновляем локальное состояние заказов
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.trackCode === trackCode
                ? { ...order, paid: true, dateOfPayment: Date.now() } // Обновляем заказ
                : order
            )
          );
        } else {
          setError("Не удалось обновить заказ.");
        }
      } catch (err: any) {
        // Ловим и обрабатываем ошибки
        setError("Ошибка при обновлении заказа: " + (err.message || "Неизвестная ошибка"));
        console.error("Ошибка обновления заказа:", err);
      }
    };
    

    const handleDelete = async (order: any) => {
      const confirmDelete = window.confirm("Вы уверены, что хотите удалить заказ?");
      if (!confirmDelete) return;
    
      try {
        // Запрос на удаление заказа
        await API.delete(`/api/orders/delete-orders/${order.clientId}`);
        alert("Заказ успешно удален!");
        
        // Дополнительно можно обновить список заказов на фронтенде
        // Например, вызвать функцию обновления данных или удалить заказ из локального состояния
      } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        alert("Не удалось удалить заказ. Пожалуйста, попробуйте еще раз.");
      }
    };


    
 
  
    const totalSum = weight * price;  
   

  // Функция для скачивания данных в Excel
  const handleDownload = () => {
    if (filterOrders.length === 0) {
      alert("Нет данных для скачивания!");
      return;
    }

    // Преобразуем данные таблицы в формат, который можно экспортировать
    const formattedData = filterOrders.map((order, idx) => ({
      "№": idx + 1,
      "Дата оплаты": order.dateOfPayment
        ? new Date(order.dateOfPayment).toLocaleDateString()
        : "—",
      "Код": order.trackCode,
      "Имя": order.name,
      "Сумма": order.price,
      "Вес": order.weight,
      "Кол-во": order.amount,
      Действие: order.paid ? "Оплачено" : "Оплатить",
    }));

    // Преобразуем таблицу в формат Excel
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Заказы");

    const fileName = selectedDate ? `${selectedDate}.xlsx` : `orders_${new Date().toLocaleDateString()}.xlsx`;

    // Скачиваем файл Excel
    XLSX.writeFile(wb, fileName);
  };
// 
// 
// 
// 
// 
const handleAdd = async () => {
  try {
    const totalSum = Number(weight) * Number(price);  

console.log(totalSum,'TOTALSUM');

    const res = await API.put("/api/orders/edit-client", {
      price: totalSum,  
      
      weight: weight,
      amount: amount,
      clientId: code, 
      
      // issued: false,

      // name: 'name',
      // createdDate: Date.now(),
      // paid: false,
      // dateOfPayment: 0,
      // deliveredDate: 0,
      // deliverTo: "Tokmok",
      // receiventInChina: false,
      // // trackCode: trackCode,
      // warehouseTokmok: false,
      // deliveredToClient: false,
    });

    
   setIsModalOpen(!isModalOpen);
    fetchOrders();
  } catch (e) {
    console.error(e);
  }
};





useEffect(() => {
  setFilteredOrders(filterOrders); // Применяем фильтрацию
}, [selectedDate, orders]); // Перезапуск при изменении выбранной даты или заказов


 useEffect(() => {
  if (filterOrders.length > 0) {
    calculateStatistics(filterOrders);
    
  }
}, [filterOrders]); // Только когда filterOrders изменяется

   // Загрузка заказов при изменении поискового термина
   useEffect(() => {
    fetchOrders();
    console.log(filteredOrders,fetchOrders );
    
  }, [searchTerm]);


  useEffect(() => {
    fetchPrice();  
  }, [fetchPrice]); 


  console.log();
  
 
  
  return (
  <div className="bg-image min-h-screen">
      <div className="p-6 container md:mx-auto">
      {/* Breadcrumbs */}
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
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)} // Просто обновляем состояние
    type="text"
    className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
    placeholder="Поиск"
  />
 
</div>

   

      <div className="flex gap-2 overflow-x-auto mb-4 p-2 border-b">
      {uniquePaymentDates.map((date) => (
          <button
            key={date}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedDate === date
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedDate(date) 
              
            }
          >
            {date}
          </button>
      ))}
    </div>

      {/* Download Button and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <button 
         onClick={handleDownload}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">
          Скачать
        </button>
        <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          + Добавить
        </button>
       </div>


       {isModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Добавление заказа</h2>

      <form>
        {/* Поля формы */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Трек код</label>
          <input
            type="text"
            value={trackCode}
            onChange={(e) => setTrackCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Введите трек код"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Код клиента</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Введите код клиента"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Количество</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Введите количество"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Вес (кг)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Введите вес"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Итоговая сумма</label>
          <input
            type="number"
            value={totalSum.toFixed(2)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
            onClick={() => toggleModal(null)}
          >
            Отмена
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={handleAdd}
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
)}






      {/* Payment Table */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-md mb-6 overflow-x-auto flex text-center">
        <table className="min-w-full bg-white">
        <thead>
    <tr >
      {["№", "Дата оплаты", "Имя пользователя", "Код",   "Сумма", "Вес", "Кол-во", "Действие"].map((header) => (
        <th key={header} className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700  ">
          {header}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
            {filterOrders.length > 0 ? (
              filterOrders.map((order, idx) => (
                <tr key={order.id}>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.dateOfPayment
                      ? new Date(order.dateOfPayment).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.name}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.clientId}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.price}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.weight}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.amount}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700 gap-4 flex flex-row justify-between items-center">
  <button
    className={`font-semibold py-2 px-4 rounded-lg ${
      order.paid
        ? "bg-green-500 text-white cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
    disabled={order.paid} // Кнопка отключается, если заказ уже оплачен
    onClick={() => handlePaid(order)} // Вызывается функция handlePaid
  >
    {order.paid ? "Оплачено" : "Оплатить"} {/* Динамическая метка */}
  </button>

  <button
    className={`font-semibold py-2 px-4 rounded-lg text-white   bg-red-500 hover:bg-red-600 text-white"
    }`}
    // disabled={order.paid} // Кнопка отключается, если заказ уже оплачен
    onClick={() => handleDelete(order)} // Вызывается функция handlePaid
  >
   Удалить
  </button>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-3 px-4 text-center border-b text-gray-700"
                >
                  Нет заказов для выбранной даты
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>















{/* STATISTIC */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-bold text-xl">
  {/* Clients Count */}
  <div className="p-4 bg-blue-300 rounded-lg">
    <div className="text-sm text-gray-700">
      Кол-во клиентов: {stats.clientsCount || 0} шт
    </div>
    <div className="text-sm text-gray-700">
      Оплатил: {stats.paidClients || 0} шт
    </div>
    <div className="text-sm text-gray-700">
      Осталось: {stats.remainingClients || 0} шт
    </div>
  </div>
  {/* Total Amount */}
  <div className="p-4 bg-green-300 rounded-lg">
    <div className="text-sm text-gray-700">
      Общая сумма: {stats.totalAmount || 0} сом
    </div>
    <div className="text-sm text-gray-700">
      Оплатил: {stats.paidAmount || 0} сом
    </div>
    <div className="text-sm text-gray-700">
      Осталось: {stats.remainingAmount || 0} сом
    </div>
  </div>
  {/* Total Weight */}
  <div className="p-4 bg-yellow-300 rounded-lg">
    <div className="text-sm text-gray-700">
      Общий вес: {(stats.totalWeight || 0).toFixed(2)} кг
    </div>
    <div className="text-sm text-gray-700">
      Оплатил за: {(stats.paidWeight || 0).toFixed(2)} кг
    </div>
    <div className="text-sm text-gray-700">
      Осталось: {(stats.remainingWeight || 0).toFixed(2)} кг
    </div>
  </div>
  {/* Product Count */}
  <div className="p-4 bg-red-300 rounded-lg">
    <div className="text-sm text-gray-700">
      Кол-во товаров: {stats.productCount || 0} шт
    </div>
    <div className="text-sm text-gray-700">
      Оплачено за: {stats.paidProducts || 0} шт
    </div>
    <div className="text-sm text-gray-700">
      Осталось: {stats.remainingProducts || 0} шт
    </div>
  </div>
</div>

    </div>

  </div>







  );
};

export default PaymentsPage;
