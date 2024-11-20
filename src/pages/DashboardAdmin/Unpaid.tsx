import { useEffect, useState } from "react";
import { API } from "../../constants/api";

const Unpaid: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]); // State for unpaid orders
    const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error messages
  
    // Function to fetch unpaid orders
    const fetchUnpaidOrders = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const response = await API.get("/api/orders/allOrders");
        console.log("API Response:", response.data);
  
        const ordersArray = Array.isArray(response.data) ? response.data : [];
        const unpaidOrders = ordersArray.filter((order: any) => order.paid === false);
  
        setOrders(unpaidOrders);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        setError("Не удалось загрузить заказы. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
  
    // Function to mark an order as paid
    const markAsPaid = async (orderId: string) => {
      try {
        await API.put(`/api/orders/${orderId}`, { paid: true });
        console.log(`Order ${orderId} marked as paid`);
        // Update the state to remove the order from the unpaid list
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } catch (error: any) {
        console.error("Error updating order:", error);
        setError("Не удалось обновить статус заказа. Попробуйте позже.");
      }
    };
  
    useEffect(() => {
      fetchUnpaidOrders();
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-100 p-8">
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
            <a href="/payment" className="text-blue-500 hover:underline">
              Оплата
            </a>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>Неоплаченные</li>
          </ol>
        </nav>
  
        {/* Feedback Section */}
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
                  <th className="px-4 py-2 border-b">Дата создания</th>
                  <th className="px-4 py-2 border-b">Трек-код</th>
                  <th className="px-4 py-2 border-b">Оплачен</th>
                  <th className="px-4 py-2 border-b">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="px-4 py-2 border-b">{index + 1}</td>
                      <td className="px-4 py-2 border-b">{order.name}</td>
                      <td className="px-4 py-2 border-b">{order.amount}</td>
                      <td className="px-4 py-2 border-b">{order.price} сом</td>
                      <td className="px-4 py-2 border-b">
                        {new Date(order.createdDate * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b">{order.trackCode}</td>
                      <td className="px-4 py-2 border-b">
                        {order.paid ? "Да" : "Нет"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="px-3 py-1 mr-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                          onClick={() => markAsPaid(order._id)}
                        >
                          Оплачено
                        </button>
                        <button
                          className="px-3 py-1 mr-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                          onClick={() => console.log("Delete order:", order._id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
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
  