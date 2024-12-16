import { useEffect, useState } from 'react';
import { OrderList } from './OrderList';
 import { Link, useNavigate } from 'react-router-dom';
import AddItemModal from '../../components/ClientComponents/AddItemModal';
import InformationModal from '../../components/ClientComponents/InformationModal';
import { API } from '../../constants/api';
 

 
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





const DashboardClient: React.FC = ({}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [client, setClient] = useState();

  const [clientId, setClientId] = useState(localStorage.getItem('clientId') || '');
  // console.log(clientId);
  
  const [error, setError] = useState('')

  const navigate = useNavigate(); // хук для перенаправления

// console.log(client,'-------------');



   const fetchClient = async () => {
    if (!clientId) {
      console.error('Client ID не установлен');
      return;
    }
    try {
      const res = await API.get(`/api/orders/client/${clientId}`);
      setClient(res.data);
      console.log('Client data:', res.data);
    } catch (e) {
      console.error('Error fetching client:', e);
    }
  };


  useEffect(() => {
    // Проверяем, есть ли токен и clientId в localStorage
    const token = localStorage.getItem('token');
    const clientIdFromStorage = localStorage.getItem('clientId');

    if (!token || !clientIdFromStorage) {
      // Если нет токена или clientId, перенаправляем на страницу логина
      navigate('/login'); // путь на страницу логина
    } else {
      setClientId(clientIdFromStorage);
      fetchOrders();
    }
  }, [navigate]); // Следим за изменениями navigate

  // useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/api/orders/history');
        const ordersWithDefaults = res.data.map((order: any) => ({
          ...order,
          weight: order.weight || 0,
          amount: order.amount || 0,
        }));
        setOrders(ordersWithDefaults);
        // console.log(ordersWithDefaults,'7');
        if (ordersWithDefaults.length > 0) {
          setClientId(ordersWithDefaults[0].clientId);
        }
        
      } catch (e) {
        console.error('Error fetching orders:', e);
      }
    };
    // fetchOrders();
  // }, [setClientId]);

  useEffect(() => {
    // console.log('Client ID:', clientId);

    fetchOrders();
    fetchClient()

   }, []);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);



  // const getNotificationData = () => {
  //   const unpaidOrders = orders.filter((order) => !order.paid);  // Фильтруем неоплаченные заказы
  //   const totalOrders = unpaidOrders.length;
  //   const totalWeight = unpaidOrders.reduce((acc, order) => acc + order.weight, 0);
  //   const totalAmount = unpaidOrders.reduce((acc, order) => acc + order.amount, 0);

  //   return { totalOrders, totalWeight, totalAmount };
  // };

  // const addNewOrder = (newOrder: Order) => {
  //   setOrders((prevOrders) => [...prevOrders, newOrder]);
  // };

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




 
  

  return (
    <div className='bg-image  min-h-screen'>
      <div className="container md:mx-auto  px-4 flex flex-col items-start">
        <h1 className="py-8 text-2xl font-bold">Добро пожаловать в Личный Кабинет</h1>
  


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
         <OrderList orders={orders}  onDeleteOrder={(trackCode) => deleteOrder(trackCode, clientId)}    clientData={client} />
        {/* <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} addNewOrder={addNewOrder} /> */}
        <AddItemModal
 isOpen={isAddModalOpen}
 closeModal={() => {
   closeAddModal();
   fetchOrders(); // Обновляем заказы после добавления
 }}
/>

        <InformationModal isOpen={isInfoModalOpen} closeModal={closeInfoModal} />
      </div>
    </div>
  );
};


export default DashboardClient;
 