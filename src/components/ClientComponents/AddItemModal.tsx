import { useState } from "react";
import { API } from "../../constants/api";

interface OrderDetails {
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
  warehouseChina: boolean; // Обязательно
  warehouseTokmok: boolean; // Обязательно
  deliveredToClient: boolean; // Обязательно
}

interface AddItemModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addNewOrder: (newOrder: OrderDetails) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, closeModal, addNewOrder }) => {
  const [description, setDescription] = useState('');
  const [trackCode, setTrackCode] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTrackCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackCode(e.target.value);
  };

  const handleAdd = async () => {
    console.log('Description:', description);
    closeModal();

    try {
      const res = await API.post('/api/orders/create', {
        issued: false,
        price: 0,
        name: description,
        createdDate: Date.now(),
        paid: false,
        weight: 0,
        amount: 1,
        dateOfPayment: 0,
        deliveredDate: 0,
        deliverTo: "Tokmok",
        receiventInChina: false,
        trackCode: trackCode,
      });

      console.log(111, res);

      addNewOrder({
        id: res.data.id, // предполагается, что сервер возвращает id
        name: description,
        createdDate: new Date().toString(),
        price: 0,
        weight: 0,
        amount: 1,
        dateOfPayment: 0,
        deliveredDate: 0,
        deliverTo: "Tokmok",
        trackCode: trackCode,
        issued: false,
        paid: false,
        receiventInChina: false,
        warehouseChina: false, // Убедитесь, что это значение установлено
        warehouseTokmok: false, // Убедитесь, что это значение установлено
        deliveredToClient: false, // Убедитесь, что это значение установлено
      });

    } catch (e) {
      console.error(e);
      alert('Ошибка при добавлении заказа. Попробуйте снова позже.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Добавить товар</h2>
        <div className="mb-6">
          <label htmlFor="trackCode" className="block text-sm font-medium text-gray-700 mb-2">Трек код</label>
          <input
            type="text"
            id="trackCode"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Введите трек код"
            value={trackCode}
            onChange={handleTrackCodeChange}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
          <input
            type="text"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Введите описание"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
            onClick={closeModal}
          >
            Закрыть
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            onClick={handleAdd}
          >
            Добав ить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;