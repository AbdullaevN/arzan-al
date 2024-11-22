import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../../constants/api';

// Интерфейс клиента
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
  const [clients, setClients] = useState<Client[]>([]); // Список клиентов
  // const [newClient, setNewClient] = useState<Client>({
  //   id: 0,
  //   phone: '',
  //   firstName: '',
  //   lastName: '',
  //   code: '',
  //   password: '',
  //   isActive: true,
  // });
  const navigate = useNavigate();

   useEffect(() => {
    API
      .get('/api/orders/allClients') 
      .then((response) => setClients(response.data))
       
      .catch((error) => console.error('Ошибка загрузки клиентов:', error));
  }, []);

  //  const handleDelete = (id: number) => {
  //   if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
  //     API
  //       .delete(`/api/allOrders/${id}`)
  //       .then(() => {
  //         setClients(clients.filter((client) => client.id !== id));
  //         alert('Клиент удален!');
  //       })
  //       .catch((error) => {
  //         console.error('Ошибка удаления клиента:', error);
  //         alert('Ошибка удаления клиента.');
  //       });
  //   }
  // };

  //  const handleAddClient = () => {
  //   API
  //     .post('/api/allOrders', newClient)
  //     .then((response) => {
  //       setClients([...clients, response.data]);
  //       alert('Клиент добавлен!');
  //       setNewClient({
  //         id: 0,
  //         phone: '',
  //         firstName: '',
  //         lastName: '',
  //         code: '',
  //         password: '',
  //         isActive: true,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Ошибка добавления клиента:', error);
  //       alert('Ошибка добавления клиента.');
  //     });
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Хлебные крошки */}
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

       {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Добавить клиента</h2>
        <div className="space-y-4">
          {['phone', 'firstName', 'lastName', 'code', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : 'text'}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="px-4 py-2 border rounded"
              value={(newClient as any)[field]}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  [field]: e.target.value,
                })
              }
            />
          ))}
          <div className="flex items-center">
            <label htmlFor="isActive" className="mr-2">
              Активен:
            </label>
            <input
              type="checkbox"
              id="isActive"
              checked={newClient.isActive}
              onChange={(e) =>
                setNewClient({ ...newClient, isActive: e.target.checked })
              }
            />
          </div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            // onClick={handleAddClient}
          >
            Добавить клиента
          </button>
        </div>
      </div> */}

      {/* Таблица клиентов */}
      <div className="overflow-x-auto">
  <table className="min-w-full bg-white rounded-lg shadow-lg">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b">Имя пользователя</th>
        <th className="px-4 py-2 border-b">Телефон</th>
        <th className="px-4 py-2 border-b">Заказы</th>
        {/* <th className="px-4 py-2 border-b">Цена</th> */}
        {/* <th className="px-4 py-2 border-b">Статус</th> */}
        <th className="px-4 py-2 border-b">Действия</th>
      </tr>
    </thead>
    <tbody>
      {clients.map((client) => (
        <tr key={client._id} className="hover:bg-gray-100">
          <td className="px-4 py-2 border-b text-center">{client.clientId}</td> {/* Updated ID */}
          <td className="px-4 py-2 border-b text-center">{client.phone}</td>
          {/* <td className="px-4 py-2 border-b text-center">
             {client.orders.length > 0 ? `${client.orders.length} заказ(ов)` : 'Нет заказов'}
          </td>
          <td className="px-4 py-2 border-b text-center">
             {client.orders.reduce((total, order) => total + order.price, 0)} 
          </td> */}
          <td className="px-4 py-2 border-b text-center">
            {client.isActive ? 'Активен' : 'Неактивен'}
          </td>
          <td className="px-4 py-2 border-b text-center">
            <button
              className="px-3 py-1 mr-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              onClick={() => navigate(`/edit/${client._id}`)}
            >
              Изменить
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              // onClick={() => handleDelete(client.id)}
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
