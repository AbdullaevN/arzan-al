import React, { useState, useEffect, useCallback } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";

interface Order {
  name: string;
  price: number;
  createdDate: number;
  paid: boolean;
  issued: boolean;
}

interface Client {
  clientId: string;
  name: string;
  city: string;
  orders: Order[];
}

const HistoryPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/api/orders/allClients");
      console.log(response.data);

      if (Array.isArray(response.data)) {
        setClients(response.data); // Устанавливаем всех клиентов с заказами
      } else {
        setClients([]); // Если ответ не массив, устанавливаем пустой список
      }
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить заказы");
      console.error("Ошибка загрузки заказов:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleBack = () => navigate(-1); // Go back to the previous page

  // Фильтрация заказов по трек-коду для всех клиентов
  const filteredOrders = clients
    .flatMap(client => 
      client.orders.filter(order =>
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(order => ({ ...order, clientName: client.name, clientCity: client.city }))
    );

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
          <li>Заказы</li>
        </ol>
      </nav>

      <button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">
        Назад
      </button>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Поиск по названию товара"
        className="px-4 py-2 border rounded w-full mb-4"
      />

      {loading && <p>Загрузка заказов...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">№</th>
                <th className="px-4 py-2 border-b">Название</th>
                <th className="px-4 py-2 border-b">Цена</th>
                <th className="px-4 py-2 border-b">Город</th>
                <th className="px-4 py-2 border-b">Дата создания</th>
                <th className="px-4 py-2 border-b">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                  <td className="px-4 py-2 border-b text-center">{order.name}</td>
                  <td className="px-4 py-2 border-b text-center">{order.price} сом</td>
                  <td className="px-4 py-2 border-b text-center">{order.clientCity}</td>
                  <td className="px-4 py-2 border-b text-center">{new Date(order.createdDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {order.paid ? "Оплачено" : "Не оплачено"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
