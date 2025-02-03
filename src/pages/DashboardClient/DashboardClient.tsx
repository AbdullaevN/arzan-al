import { useEffect, useState } from 'react';
import { OrderList } from './OrderList';
import { Link, useNavigate } from 'react-router-dom';
import AddItemModal from '../../components/ClientComponents/AddItemModal';
import InformationModal from '../../components/ClientComponents/InformationModal';
import { API } from '../../constants/api';
import Notification from './Notification';
import usePriceStore from '../../store/useClient';

interface Order {
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
  clientId: string;
  issued: boolean;
  paid: boolean;
  receiventInChina: boolean;
  description?: string;
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
}

const DashboardClient: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [client, setClient] = useState<any>(null); // Client data state
  const [clientId, setClientId] = useState(localStorage.getItem('clientId') || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { price, fetchPrice } = usePriceStore();
  console.log(price,'i');

  const checkAuthorization = () => {
    const token = localStorage.getItem('token');
    const clientIdFromStorage = localStorage.getItem('clientId');

    if (!token || !clientIdFromStorage) {
      navigate('/login'); // Redirect to login page if not authorized
      return false;
    }
    return true;
  };

  const fetchClient = async () => {
    if (!checkAuthorization()) return;
  
    try {
      const res = await API.get(`/api/orders/client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClient(res.data); // Сохраняем данные клиента в `state`
      console.log('Client data:', res.data);
    } catch (e: any) {
      if (e.response?.status === 401) {
        console.error('Unauthorized, redirecting to login.');
        navigate('/login');
      } else {
        console.error('Error fetching client:', e);
      }
    }
  };
  

  const fetchOrders = async () => {
    if (!checkAuthorization()) return;

    try {
      const res = await API.get('/api/orders/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const ordersWithDefaults = res.data.map((order: any) => ({
        ...order,
        weight: order.weight || 0,
        amount: order.amount || 0,
      }));
      setOrders(ordersWithDefaults);
      if (ordersWithDefaults.length > 0) {
        setClientId(ordersWithDefaults[0].clientId);
      }
    } catch (e: any) {
      if (e.response?.status === 401) {
        console.error('Unauthorized, redirecting to login.');
        navigate('/login');
      } else {
        console.error('Error fetching orders:', e);
      }
    }
  };

  useEffect(() => {
    if (checkAuthorization()) {
      fetchOrders();
      fetchClient();
      fetchPrice()
    }
  }, [fetchPrice]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const addNewOrder = (newOrder: Order) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const deleteOrder = async (trackCode: string, clientId: string) => {
    if (!clientId || !trackCode) {
      setError('Отсутствует идентификатор клиента');
      console.error('Не указан clientId для заказа:', trackCode, clientId);
      return;
    }

    try {
      if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;

      console.log('Попытка удалить заказ:', trackCode, 'для клиента:', clientId);
      await API.delete(`/api/orders/delete/${trackCode}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setOrders(orders.filter(order => order.trackCode !== trackCode));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении заказа');
      console.error('Ошибка при удалении заказа:', err);
    }
  };

  // const unpaidOrders = orders.filter(order => !order.paid);
  const unpaidImports = client?.imports?.filter((order: any) => !order.paid) || [];


   

  return (
    <div className="bg-image min-h-screen">
      <div className="container md:mx-auto px-4 flex flex-col items-start">
        <h1 className="py-8 text-2xl font-bold">Добро пожаловать в Личный Кабинет</h1>

         {/* {client && (
          <div className="client-data p-4 border bg-white rounded-md mb-4">
            <h2 className="font-bold text-xl">Client Information</h2>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Address:</strong> {client.address}</p>
           </div>
        )} */}

<div className='flex flex-wrap'>
  {unpaidImports.map((order, index) => (
   <Notification
   key={order._id || index}
   productName={`Заказ №${order._id}`}
   clientName={client?.name || 'Неизвестный клиент'}
   trackCode={order._id}
   createdDate={new Date(order.timestamp).toLocaleDateString('ru-RU')}
   weight={`${order.weight} кг`}
   price={order.price.toString()}  // Удаляем символ $
 />
  ))}
</div>

        <div className="flex flex-col md:flex-row items-start gap-4 p-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={openAddModal}
          >
            Добавить
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={openInfoModal}
          >
            Информация
          </button>
          <Link to="/archive">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Архив
            </button>
          </Link>
        </div>

        <OrderList orders={orders} onDeleteOrder={(trackCode) => deleteOrder(trackCode, clientId)} clientData={client} />
        <AddItemModal
          isOpen={isAddModalOpen}
          closeModal={() => {
            closeAddModal();
            fetchOrders(); // Refresh orders after adding
          }}
        />
        <InformationModal isOpen={isInfoModalOpen} closeModal={closeInfoModal} />
      </div>
    </div>
  );
};

export default DashboardClient;
