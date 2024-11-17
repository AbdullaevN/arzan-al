import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Client {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  code: string;
  password: string;
  isActive: boolean;
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    phone: '',
    firstName: '',
    lastName: '',
    code: '',
    password: '',
    isActive: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/orders')
      .then((response) => setClients(response.data))
      .catch((error) => console.error('Ошибка загрузки клиентов:', error));
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      axios
        .delete(`http://localhost:5000/orders/${id}`)
        .then(() => {
          setClients(clients.filter((client) => client.id !== id));
          alert('Клиент удален!');
        })
        .catch((error) => {
          console.error('Ошибка удаления клиента:', error);
          alert('Ошибка удаления клиента.');
        });
    }
  };

  const handleAddClient = () => {
    axios
      .post('http://localhost:5000/orders', newClient)
      .then((response) => {
        setClients([...clients, response.data]);
        alert('Клиент добавлен!');
        setNewClient({
          id: 0,
          phone: '',
          firstName: '',
          lastName: '',
          code: '',
          password: '',
          isActive: true,
        });
      })
      .catch((error) => {
        console.error('Ошибка добавления клиента:', error);
        alert('Ошибка добавления клиента.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
          <li>Клиенты</li>
        </ol>
      </nav>
      {/* Форма добавления нового клиента */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Добавить клиента</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Телефон"
            className="px-4 py-2 border rounded"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Имя"
            className="px-4 py-2 border rounded"
            value={newClient.firstName}
            onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Фамилия"
            className="px-4 py-2 border rounded"
            value={newClient.lastName}
            onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Код"
            className="px-4 py-2 border rounded"
            value={newClient.code}
            onChange={(e) => setNewClient({ ...newClient, code: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="px-4 py-2 border rounded"
            value={newClient.password}
            onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
          />
          <div className="flex items-center">
            <label htmlFor="isActive" className="mr-2">Активен:</label>
            <input
              type="checkbox"
              id="isActive"
              checked={newClient.isActive}
              onChange={(e) => setNewClient({ ...newClient, isActive: e.target.checked })}
            />
          </div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleAddClient}
          >
            Добавить клиента
          </button>
        </div>
      </div>

      {/* Таблица клиентов */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">#ID</th>
              <th className="px-4 py-2 border-b">Телефон</th>
              <th className="px-4 py-2 border-b">Фамилия Имя</th>
              <th className="px-4 py-2 border-b">Код</th>
              <th className="px-4 py-2 border-b">Пароль</th>
              <th className="px-4 py-2 border-b">Состояние</th>
              <th className="px-4 py-2 border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-center">{client.id}</td>
                <td className="px-4 py-2 border-b text-center">{client.phone}</td>
                <td className="px-4 py-2 border-b text-center">
                  {`${client.firstName} ${client.lastName}`}
                </td>
                <td className="px-4 py-2 border-b text-center">{client.code}</td>
                <td className="px-4 py-2 border-b text-center">{client.password}</td>
                <td className="px-4 py-2 border-b text-center">
                  {client.isActive ? 'Активен' : 'Неактивен'}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <button
                    className="px-3 py-1 mr-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    onClick={() => navigate(`/edit/${client.id}`)}
                  >
                    Изменить
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                    onClick={() => handleDelete(client.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
