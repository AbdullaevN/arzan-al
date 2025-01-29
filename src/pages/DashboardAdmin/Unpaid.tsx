import { useEffect, useState } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";

const Unpaid: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUnpaidOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/api/orders/allClients");
      console.log("API Response:", response.data);

      const ordersArray = Array.isArray(response.data ) ? response.data : [];

      // Фильтрация только неоплаченных заказов
      const unpaidOrders = ordersArray.filter((order: any) => order.paid === false);

      setOrders(unpaidOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError("Не удалось загрузить заказы. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen p-8 container md:mx-auto">
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
          <a href="/payment" className="text-blue-500 hover:underline">
            Оплата
          </a>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Неоплаченные</li>
        </ol>
      </nav>
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Назад
      </button>

      {loading && (
        <div className="text-center text-gray-500 py-8">Загрузка...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">№</th>
                <th className="px-4 py-2 border-b">Название</th>
                <th className="px-4 py-2 border-b">Количество</th>
                <th className="px-4 py-2 border-b">Цена</th>
                <th className="px-4 py-2 border-b">Оплачен</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id} className="text-center">
                    <td className="flex items-center text-center px-4 py-2 border-b">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border-b">{order.name}</td>
                    <td className="px-4 py-2 border-b">{order.amount}</td>
                    <td className="px-4 py-2 border-b">{order.price} сом</td>
                    <td className="px-4 py-2 border-b">
                      {order.paid ? "Да" : "Нет"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Нет неоплаченных заказов
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Unpaid;
