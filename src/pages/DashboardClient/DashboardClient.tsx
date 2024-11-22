import { useEffect, useState } from 'react';
import { OrderList } from './OrderList';
import Notification from './Notification';
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
      } catch (e) {
        console.error('Error fetching orders:', e);
      }
    };
    fetchOrders();
  }, []);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const getNotificationData = () => {
    const unpaidOrders = orders.filter((order) => !order.paid);  // Фильтруем неоплаченные заказы
    const totalOrders = unpaidOrders.length;
    const totalWeight = unpaidOrders.reduce((acc, order) => acc + order.weight, 0);
    const totalAmount = unpaidOrders.reduce((acc, order) => acc + order.amount, 0);

    return { totalOrders, totalWeight, totalAmount };
  };

  const addNewOrder = (newOrder: Order) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const deleteOrder = async (trackCode: string) => {
    try {
      // Ваш запрос на удаление
      const response = await API.delete(`/api/orders/delete/${trackCode}`);
      console.log('Удален заказ:', response);

      // Обновляем список заказов
      const updatedOrders = orders.filter(order => order.trackCode !== trackCode);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error);
    }
  };

  return (
    <div className='bg-image'>
      <div className="container px-4 flex flex-col items-start">
        <h1 className="py-8 text-2xl font-bold">Добро пожаловать в Личный Кабинет</h1>
         {/* {getNotificationData().totalOrders > 0 && (
          <Notification {...getNotificationData()} />
        )} */}
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
        <OrderList orders={orders} onDeleteOrder={deleteOrder} />
        <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} addNewOrder={addNewOrder} />
        <InformationModal isOpen={isInfoModalOpen} closeModal={closeInfoModal} />
      </div>
    </div>
  );
};


export default DashboardClient;
