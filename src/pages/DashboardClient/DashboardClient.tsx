import { useEffect, useState } from 'react';
import { OrderList } from './OrderList';
import Notification from './Notification';
import { Link } from 'react-router-dom';
 import AddItemModal from '../../components/ClientComponents/AddItemModal'; // Import AddItemModal
import InformationModal from '../../components/ClientComponents/InformationModal';
import { API } from '../../constants/api';
 
const DashboardClient = () => {
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  console.log('order',orders);
  

const fetchOrders = async () => {

try {
  const res  = await API.get('/api/orders/history')
  setOrders(res.data)

  }catch(e){
console.log(e);

  }
}
useEffect(()=>{
fetchOrders()
},[])





  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard container px-3">
      <h1 className='py-8'>Добро пожаловать в Личный Кабинет</h1>

      <Notification />






     

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




        {orders.map((order) => (

          <>
          <div>
            
          </div>
          </>
        ))}




        <OrderList />

        {/* Modal for Add Item */}
        <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} />

        {/* Modal for Information */}
        <InformationModal isOpen={isInfoModalOpen} closeModal={closeInfoModal} />

        {/* General Modal */}
        {/* <Modal isOpen={isModalOpen} closeModal={closeModal} /> */}
      </div>
    </div>
  );
};

export default DashboardClient;
