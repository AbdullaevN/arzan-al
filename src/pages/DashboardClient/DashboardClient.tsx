import { useEffect, useState } from 'react';
import { OrderList } from './OrderList';
 import { Link } from 'react-router-dom';
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





const DashboardClient: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
 
  const [clientId, setClientId] = useState(localStorage.getItem('clientId') || '');
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/api/orders/history');
        const ordersWithDefaults = res.data.map((order: any) => ({
          ...order,
          weight: order.weight || 0,
          amount: order.amount || 0,
        }));
        setOrders(ordersWithDefaults);
        console.log(ordersWithDefaults,'7');
        if (ordersWithDefaults.length > 0) {
          setClientId(ordersWithDefaults[0].clientId);
        }
        
      } catch (e) {
        console.error('Error fetching orders:', e);
      }
    };
    fetchOrders();
  }, [setClientId]);

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
         <OrderList orders={orders}  onDeleteOrder={(trackCode) => deleteOrder(trackCode, clientId)} />
        <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} addNewOrder={addNewOrder} />
        <InformationModal isOpen={isInfoModalOpen} closeModal={closeInfoModal} />
      </div>
    </div>
  );
};


export default DashboardClient;
 