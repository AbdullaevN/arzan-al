import { useEffect, useState } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";
 
const Unpaid: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]); // State for unpaid orders
    const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error messages

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


    const navigate = useNavigate();

 
  
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
  
    const handlePaid = async (selectedOrder: Order) => {
      if (!selectedOrder) {
        setError("Client ID is missing or no order selected.");
        return;
      }
    
      const { trackCode } = selectedOrder;
      const isConfirmed = window.confirm(
        `Вы действительно хотите отметить заказ с трек-кодом "${trackCode}" как оплаченный?`
      );
    
      if (!isConfirmed) {
        return; // Exit if user cancels
      }
    
      try {
        // Send the request to update the order as paid
        const response = await API.put(
          `/api/orders/edit/${trackCode}`,
          { ...selectedOrder, paid: true, dateOfPayment: Date.now() }, // Add dateOfPayment
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
    
        if (response.status === 200) {
          // Update the order in the local state
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.trackCode === trackCode
                ? { ...order, paid: true, dateOfPayment: Date.now() }
                : order
            )
          );
        } else {
          setError("Failed to update order.");
        }
      } catch (err: any) {
        setError("Error updating order: " + (err.message || "Unknown error"));
        console.error("Update order error:", err);
      }
    };
    
    
    
    
    

  
    useEffect(() => {
      fetchUnpaidOrders();
    }, []);




     
    const handleBack = () => {
      navigate(-1); // Go back to the previous page
    };
  
    return (
      <div className="min-h-screen   p-8  container md:mx-auto">
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
                  {/* <th className="px-4 py-2 border-b">Действия</th> */}
                </tr>
              </thead>
              <tbody className="">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order._id}  className=" text-center">
                      <td className="flex items-center text-center px-4 py-2 border-b">{index + 1}</td>
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
                      {/* <td className="px-4 py-2 border-b">
                      <button
                      className={`font-semibold py-2 px-4 rounded-lg ${
                        order.paid
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      disabled={order.paid}
                      onClick={() => handlePaid(order)}
                    >
                      {order.paid ? "Оплачено" : "Оплатить"}
                    </button>

                      
                      </td> */}
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
  