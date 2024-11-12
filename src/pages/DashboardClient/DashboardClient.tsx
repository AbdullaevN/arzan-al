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
  deliveredToClient?: boolean;
}

const DashboardClient = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/api/orders/history');
      const ordersWithWeightAndAmount = res.data.map((order: any) => ({
        ...order,
        weight: order.weight || 0,
        amount: order.amount || 0,
      }));
      setOrders(ordersWithWeightAndAmount);
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const getNotificationData = () => {
    const totalOrders = orders.length;
    const totalWeight = orders.reduce((acc, order) => acc + (order.weight || 0), 0);
    const totalAmount = orders.reduce((acc, order) => acc + (order.amount || 0), 0);

    return { totalOrders, totalWeight, totalAmount };
  };

  const addNewOrder = (newOrder: Order) => {
    const order: Order = {
      ...newOrder,
      warehouseChina: newOrder.warehouseChina || false,
      warehouseTokmok: newOrder.warehouseTokmok || false,
      deliveredToClient: newOrder.deliveredToClient ?? false, // Ensure a boolean value
    };
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  return (
    <div className="dashboard container px-3">
      <h1 className="py-8">Добро пожаловать в Личный Кабинет</h1>
      <Notification {...getNotificationData()} />
      <div className="dashboard-sections flex gap-4 p-4 flex-col">
        <div className="flex gap-1 items-center justify-around md:justify-start md:gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={openAddModal}
          >
            Добавить
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={openInfoModal}
          >
            Информация
          </button>
          <Link to="/archive">
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
              Архив
            </button>
          </Link>
        </div>
        <OrderList orders={orders} />
        <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} addNewOrder={addNewOrder} />
        <InformationModal isOpen={isInfoModalOpen} closeModal={closeInfoModal} />
      </div>
    </div>
  );
};

export default DashboardClient;
