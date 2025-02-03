import React, { useState, useEffect, useCallback } from "react";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";

interface ImportOrder {
  timestamp: number;
  paid: boolean;
  price: number;
  weight: number;
  clientId: string;
  amount: number;
}

interface Client {
  clientId: string;
  name: string;
  city: string;
  imports: ImportOrder[]; // Assuming imports is inside each client
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
        setClients(response.data); // Set all clients with their imports
      } else {
        setClients([]); // If response is not an array, set an empty list
      }
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить данные");
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleBack = () => navigate(-1);

  // Filter imports across all clients
  const filteredImports = clients
    .flatMap(client =>
      client.imports
        .filter(importOrder =>
          importOrder.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          importOrder.timestamp.toString().includes(searchTerm) ||
          importOrder.price.toString().includes(searchTerm)
        )
        .map(importOrder => ({
          ...importOrder,
          clientName: client.name,
          clientCity: client.city,
        }))
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
        placeholder="Поиск по ID клиента или цене"
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
                <th className="px-4 py-2 border-b">ID клиента</th>
                <th className="px-4 py-2 border-b">Цена</th>
                <th className="px-4 py-2 border-b">Вес</th>
                <th className="px-4 py-2 border-b">Дата</th>
                <th className="px-4 py-2 border-b">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredImports.map((importOrder, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                  <td className="px-4 py-2 border-b text-center">{importOrder.clientId}</td>
                  <td className="px-4 py-2 border-b text-center">{importOrder.price} сом</td>
                  <td className="px-4 py-2 border-b text-center">{importOrder.weight} кг</td>
                  <td className="px-4 py-2 border-b text-center">
                    {new Date(importOrder.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {importOrder.paid ? "Оплачено" : "Не оплачено"}
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
