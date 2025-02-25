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
  warehouseChina: boolean;
  warehouseTokmok: boolean;
  deliveredToClient: boolean;
}

interface AddItemModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addNewOrder: (newOrder: OrderDetails) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, closeModal }) => {
  const [description, setDescription] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [warehouseChina, setWarehouseChina] = useState(false); // Новое состояние
  const [loading, setLoading] = useState(false); // Состояние для индикатора загрузки
  
  const clientId = localStorage.getItem('clientId');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTrackCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackCode(e.target.value);
  };

  const handleWarehouseChinaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWarehouseChina(e.target.checked);
  };

  const handleAdd = async () => {
    setLoading(true); // Включаем индикатор загрузки перед запросом
    try {
      const res = await API.post("/api/orders/create", {
        issued: false,
        price: 0,
        name: description,
        createdDate: Date.now(),
        paid: false,
        weight: 0,
        amount: 1,
        dateOfPayment: 0,
        deliveredDate: 0,
        // deliverTo: "Tokmok",
        receiventInChina: true,
        trackCode: trackCode,
        clientId: clientId,
        warehouseChina: true,  
        warehouseTokmok: false,
        deliveredToClient: false,
      });
      console.log(res, 'res');
      
      //  addNewOrder(res.data);
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Ошибка при добавлении заказа. Попробуйте снова позже.");
    } finally {
      setLoading(false); // Выключаем индикатор загрузки, когда запрос завершён
    }

    // Очистка полей после добавления
    setDescription("");
    setTrackCode("");
    setWarehouseChina(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Добавить товар</h2>
        <div className="mb-6">
          <label htmlFor="trackCode" className="block text-sm font-medium text-gray-700 mb-2">
            Трек код
          </label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <input
            type="text"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Введите описание"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        {/* <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="warehouseChina"
            checked={warehouseChina}
            onChange={handleWarehouseChinaChange}
            className="mr-2"
          />
          <label htmlFor="warehouseChina" className="text-sm font-medium text-gray-700">
            Склад в Китае
          </label>
        </div> */}
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
            disabled={loading} // Отключаем кнопку, пока идет загрузка
          >
            {loading ? "Загрузка..." : "Добавить"} {/* Отображаем "Загрузка..." при запросе */}
          </button>
        </div>
        {loading && (
          <p className="mt-4 text-center text-gray-600">Загружается...</p> // Текст с индикатором загрузки
        )}
      </div>
    </div>
  );
};

export default AddItemModal;
  