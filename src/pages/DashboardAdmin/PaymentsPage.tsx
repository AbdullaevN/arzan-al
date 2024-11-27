import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../constants/api";
import { useClientStore } from "../../store/useClient";
 
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

type Order = {
  trackCode: string;
  clientCode: string;
  quantity: number;
  paid: boolean;
};


interface AddItemModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addNewOrder: (newOrder: OrderDetails) => void;
}
 
const PaymentsPage: React.FC<AddItemModalProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPaid, setIsPaid] = useState(false);

 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');


  const [trackCode, setTrackCode] = useState("");
  const [weight, setWeight] = useState("");


  
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { clientId } = useClientStore();
  console.log(clientId, '12');
  


  const navigate = useNavigate();


  const toggleModal = (order: Order | null) => {
    setSelectedOrder(order);
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

 
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
 
    const handleBack = () => {
      navigate(-1); // Go back to the previous page
    };


    const handlePaid = async () => {
      console.log(selectedOrder,'SSSSSSSS');
      if (!selectedOrder ) {

        setError("Client ID is missing or no order selected.");
        return;
      }
  
      const { trackCode } = selectedOrder;
  
      try {
        // const updatedOrder = { ...selectedOrder, clientId };
         // Add clientId to the order
  
         console.log(selectedOrder,'SSSSSSSS');
         
        const response = await API.put(`/api/orders/edit/${trackCode}`, {...selectedOrder, paid:true},  {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (response.status === 200) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.trackCode === trackCode ? { ...order, ...selectedOrder } : order
            )
          );
          // closeModal();
        } else {
          setError("Failed to update order.");
        }
      } catch (err: any) {
        setError("Error updating order: " + (err.message || "Unknown error"));
        console.error("Update order error:", err);
      }
    };










    const handleTrackCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTrackCode(e.target.value);
    };

    // const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   setWeight(e.target.value);
    // };



    const price = parseFloat(localStorage.getItem("price") || "0");
  
    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputWeight = parseFloat(e.target.value) || 0;
      setWeight(inputWeight); // Update weight state
    };
  
    const totalSum = weight * price; // Calculate the total sum dynamically
  



// 
// 
// 
// 
// 
// 
// 
// 
const handleAdd = async () => {
  // closeModal();
  try {
    const res = await API.post("/api/orders/create", {
      issued: false,
      price: 0,
      name: name,
      createdDate: Date.now(),
      paid: false,
      weight: 0,
      amount: 1,
      dateOfPayment: 0,
      deliveredDate: 0,
      deliverTo: "Tokmok",
      receiventInChina: false,
      trackCode: trackCode,
      clientId: clientId,
       warehouseTokmok: false,
      deliveredToClient: false,
    });

    addNewOrder({
      id: res.data.id, // assuming server returns id
      name: name,
      createdDate: new Date().toString(),
      price: 0,
      weight: 0,
      amount: 1,
      dateOfPayment: 0,
      deliveredDate: 0,
      deliverTo: "Tokmok",
      trackCode: trackCode,
      clientId:clientId,
      issued: false,
      paid: false,
      receiventInChina: false,
       warehouseTokmok: false,
      deliveredToClient: false,
    });
  } catch (e) {
    console.error(e);
    alert("Ошибка при добавлении заказа. Попробуйте снова позже.");
  }
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
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
          placeholder="Поиск"
        />
        {/* <button 
         onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Поиск
        </button> */}
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
        <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          + Добавить
        </button>
       </div>


       {isModalOpen && selectedOrder && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Оплата заказа</h2>

      {/* Форма */}
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Код клиента</label>
          <input
            type="text"
            id="trackCode"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Введите трек код"
            value={trackCode}
            onChange={handleTrackCodeChange}
          />
        </div>

      

        {/* Редактируемое поле для веса */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Вес (кг)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={weight}
            onChange={handleWeightChange}
            // value={selectedOrder.weight}
            // onChange={(e) => {
            //   const updatedOrder = { ...selectedOrder, weight: e.target.value };
            //   setSelectedOrder(updatedOrder);  
            // }}
          />
        </div>

       

        {/* Вычисление итоговой суммы */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Итоговая сумма</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            // value={selectedOrder.weight * (parseFloat(localStorage.getItem("price")) || selectedOrder.price)}
            // readOnly
            value={totalSum.toFixed(2)} // Display total sum with 2 decimal points
            readOnly
          />
        </div>

        {/* Добавление чекбокса для подтверждения оплаты */}
      

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
            onClick={handleAdd}
            // disabled={!isPaid}  
          >
            Сохранить
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
    onClick={handlePaid}
  
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
