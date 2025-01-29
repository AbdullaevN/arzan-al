import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../../constants/api';
import useClient from '../../store/useClient';

// Интерфейс клиента
interface Client {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  code: string;
  password: string;
  isActive: boolean;
  name:string;
  clientId:string;
  city:string;


}

const ClientsPage: React.FC = () => {
  const { setClientId } = useClient();

  const [clients, setClients] = useState<Client[]>([]) 
  const navigate = useNavigate();

  useEffect(() => {
    API
      .get('/api/orders/allClients')
      .then((response) => {
        const filteredClients = response.data
          .filter((client: Client) => client.clientId !== 'admin') 
          .sort((a: Client, b: Client) => b.id - a.id); 
        setClients(filteredClients.reverse());
      })
      .catch((error) => console.error('Ошибка загрузки клиентов:', error));
  }, []);
  
  
  
  
  
  console.log(clients);
  

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  

  return (
    <div className="min-h-screen  p-8 container md:mx-auto ">
      {/* Хлебные крошки */}
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
          <li>Клиенты</li>
        </ol>
      </nav>

      {/* Кнопка "Назад" */}
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Назад
      </button>

      {/* Таблица клиентов */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">№</th>
              <th className="px-4 py-2 border-b">Код</th>
              <th className="px-4 py-2 border-b">ФИО</th>
              <th className="px-4 py-2 border-b">Телефон</th>
              <th className="px-4 py-2 border-b">Город</th>
              {/* <th className="px-4 py-2 border-b">Действия</th> */}
            </tr>
          </thead>
          <tbody>
            {clients.map((client,index) => (
              <tr key={client._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                <td className="px-4 py-2 border-b text-center">{client.clientId}</td>
                <td className="px-4 py-2 border-b text-center">{client.name}</td>
                <td className="px-4 py-2 border-b text-center">{client.phone}</td>
                <td className="px-4 py-2 border-b text-center">{client.city}</td>
                {/* <td className="px-4 py-2 border-b text-center">{client.password}</td> */}

               
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
