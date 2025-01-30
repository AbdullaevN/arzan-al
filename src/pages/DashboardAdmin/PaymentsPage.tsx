import { useEffect, useState, useMemo, useCallback } from "react";
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
  clientId: string;
  imports?: any[];
}

interface Order {
  id: string;
  clientId: string;
  trackCode: string;
  name: string;
  price: number;
  weight: number;
  amount: number;
  paid: boolean;
  dateOfPayment?: number;
  imports?: any[];
  
}

interface AddItemModalProps {
  addNewOrder: (newOrder: OrderDetails) => void;
}

const PaymentsPage: React.FC<AddItemModalProps> = ({ addNewOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [code, setCode] = useState("");
  const [weight, setWeight] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
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

  const navigate = useNavigate();

  const calculateStatistics = useCallback((data: Order[]) => {
    const newStats = {
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
    };

    data.forEach((order) => {
      if (!(order.amount > 0 || (order.imports?.length > 0))) return;

      newStats.clientsCount++;
      order.paid ? newStats.paidClients++ : newStats.remainingClients++;

      newStats.totalAmount += order.price || 0;
      order.paid 
        ? (newStats.paidAmount += order.price || 0)
        : (newStats.remainingAmount += order.price || 0);

      newStats.totalWeight += order.weight || 0;
      order.paid 
        ? (newStats.paidWeight += order.weight || 0)
        : (newStats.remainingWeight += order.weight || 0);

      newStats.productCount += order.amount || 0;
      order.paid 
        ? (newStats.paidProducts += order.amount || 0)
        : (newStats.remainingProducts += order.amount || 0);
    });

    setStats(newStats);
  }, []);

  const uniquePaymentDates = useMemo(() => 
    Array.from(
      new Set(
        orders
          .filter((order) => order.dateOfPayment)
          .map((order) =>
            new Date(order.dateOfPayment).toLocaleDateString("en-GB")
          )
      )
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    [orders]
  );

  const filteredOrders = useMemo(() => 
    orders.filter(order => {
      const hasActiveOrders = order.amount > 0 || (order.imports?.length > 0);
      const matchesDate = selectedDate 
        ? new Date(order.dateOfPayment).toLocaleDateString("en-GB") === selectedDate
        : true;
      const matchesSearch = searchTerm 
        ? order.clientId.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return hasActiveOrders && matchesDate && matchesSearch;
    }),
    [orders, selectedDate, searchTerm]
  );

  useEffect(() => {
    calculateStatistics(filteredOrders);
  }, [filteredOrders, calculateStatistics]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/orders/allClients');
      const filtered = response.data.filter((item: Order) => item.clientId !== 'admin');
      setOrders(filtered);
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchPrice();
  }, [fetchOrders, fetchPrice]);

  const handlePaid = async (order: Order) => {
    if (!order?.clientId) {
      setError("Ошибка: заказ не найден");
      return;
    }

    setProcessingPayment(order.clientId);
    const isConfirmed = window.confirm(
      `Отметить заказ ${order.clientId} как оплаченный?`
    );

    if (!isConfirmed) {
      setProcessingPayment(null);
      return;
    }

    try {
      const response = await API.put(
        `/api/orders/edit-client`,
        {
          clientId: order.clientId,
          paid: true,
          dateOfPayment: Date.now(),
        },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          },
        }
      );

      if (response.status === 200) {
        setOrders(prev => prev.map(item => 
          item.clientId === order.clientId 
            ? { ...item, ...response.data }
            : item
        ));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при оплате заказа");
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!order?.clientId) {
      alert("Ошибка: заказ не найден");
      return;
    }
  
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить заказ и все связанные импорты?");
    if (!confirmDelete) return;
  
    setDeletingId(order.clientId);
    
    try {
      // Удаляем все импорты
      if (order.imports?.length) {
        await Promise.all(
          order.imports.map(async (imp) => {
            await API.delete(`/api/imports/${imp._id}`);
          })
        );
      }
  
      // Удаляем основной заказ
      const response = await API.delete(`/api/orders/delete-orders/${order.clientId}`);
      
      if (response.status === 200) {
        setOrders(prev => prev.filter(item => item.clientId !== order.clientId));
        alert("Заказ и все связанные импорты успешно удалены!");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка при удалении заказа");
    } finally {
      setDeletingId(null);
    }
  };

  const memoizedTableRows = useMemo(() => 
    filteredOrders.map((order, idx) => (
      <tr key={order.clientId}>
        <td className="py-3 px-4 border-b text-gray-700">{idx + 1}</td>
        <td className="py-3 px-4 border-b text-gray-700">
          {order.dateOfPayment 
            ? new Date(order.dateOfPayment).toLocaleDateString() 
            : "—"}
        </td>
        <td className="py-3 px-4 border-b text-gray-700">{order.name}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.clientId}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.amount}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.weight}</td>
        <td className="py-3 px-4 border-b text-gray-700">{order.price}</td>
        <td className="py-3 px-4 border-b text-gray-700 gap-4 flex items-center justify-end">
          <button
            className={`font-semibold py-2 px-4 rounded-lg ${
              order.paid 
                ? "bg-green-500 text-white cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={order.paid || processingPayment === order.clientId}
            onClick={() => handlePaid(order)}
          >
            {processingPayment === order.clientId ? "Обработка..." : (order.paid ? "Оплачено" : "Оплатить")}
          </button>
          <button
            className="font-semibold py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white"
            disabled={deletingId === order.clientId}
            onClick={() => handleDelete(order)}
          >
            {deletingId === order.clientId ? "Удаление..." : "Удалить"}
          </button>
        </td>
      </tr>
    )),
    [filteredOrders, processingPayment, deletingId]
  );

  if (loading) return <div className="text-center p-4">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Ошибка: {error}</div>;

  return (
    <div className="bg-image min-h-screen">
      <div className="p-6 container md:mx-auto">
        <nav className="text-sm mb-4">
          <ol className="list-reset flex text-gray-500 text-lg">
            <li><Link to="/dashboard" className="text-blue-500 hover:underline">Главная</Link></li>
            <li><span className="mx-2">/</span></li>
            <li>Оплата</li>
          </ol>
        </nav>

        <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
          Назад
        </button>

        <div className="flex gap-4 mb-4">
          <Link to="/unpaid" className="bg-red-500 text-white px-4 py-2 rounded">Неоплаченные</Link>
          <Link to="/paid" className="bg-blue-500 text-white px-4 py-2 rounded">Оплаченные</Link>
        </div>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по коду клиента"
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex gap-2 overflow-x-auto mb-4 p-2 border-b">
          {uniquePaymentDates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded ${
                selectedDate === date ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                {["№", "Дата оплаты", "Имя", "Код", "Кол-во", "Вес", "Сумма", "Действия"].map(header => (
                  <th key={header} className="py-3 px-4 border-b text-center text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {memoizedTableRows.length > 0 ? (
                memoizedTableRows
              ) : (
                <tr>
                  <td colSpan={8} className="py-3 px-4 text-center border-b">
                    Нет активных заказов
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Блоки статистики */}
          <div className="p-4 bg-blue-100 rounded-lg">
            <div className="text-sm">Клиенты: {stats.clientsCount}</div>
            <div className="text-sm">Оплатили: {stats.paidClients}</div>
            <div className="text-sm">Осталось: {stats.remainingClients}</div>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <div className="text-sm">Сумма: {stats.totalAmount}</div>
            <div className="text-sm">Оплачено: {stats.paidAmount}</div>
            <div className="text-sm">Осталось: {stats.remainingAmount}</div>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <div className="text-sm">Вес: {stats.totalWeight.toFixed(2)}</div>
            <div className="text-sm">Оплачено: {stats.paidWeight.toFixed(2)}</div>
            <div className="text-sm">Осталось: {stats.remainingWeight.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-red-100 rounded-lg">
            <div className="text-sm">Товары: {stats.productCount}</div>
            <div className="text-sm">Оплачено: {stats.paidProducts}</div>
            <div className="text-sm">Осталось: {stats.remainingProducts}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;