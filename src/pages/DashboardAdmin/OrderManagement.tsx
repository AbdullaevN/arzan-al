import { useState } from "react";
import { API } from "../../constants/api";
 
const OrderManagement = () => {
  const [formData, setFormData] = useState({
    price: "",
    name: "",
    createdDate: Date.now(),
    paid: false,
    weight: "",
    amount: "",
    dateOfPayment: Date.now(),
    deliveredDate: Date.now(),
    deliverTo: "",
    receiventInChina: "",
    trackCode: "",
  });

  const [searchCode, setSearchCode] = useState("");
  const [order, setOrder] = useState<any>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

   const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await API.post("/create", formData);   
      alert("Заказ успешно добавлен!");
      setFormData({
        price: "",
        name: "",
        createdDate: Date.now(),
        paid: false,
        weight: "",
        amount: "",
        dateOfPayment: Date.now(),
        deliveredDate: Date.now(),
        deliverTo: "",
        receiventInChina: "",
        trackCode: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении заказа:", error);
      alert("Не удалось добавить заказ.");
    }
  };

  const handleCancel = () => {
    setFormData({
      price: "",
      name: "",
      createdDate: Date.now(),
      paid: false,
      weight: "",
      amount: "",
      dateOfPayment: Date.now(),
      deliveredDate: Date.now(),
      deliverTo: "",
      receiventInChina: "",
      trackCode: "",
    });
  };

  const handleSearch = async () => {
    try {
      const response = await API.get(`/search/${searchCode}`);  // Используем API для поиска
      setOrder(response.data);
      alert(`Заказ найден: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Ошибка при поиске заказа:", error);
      alert("Не удалось найти заказ.");
    }
  };

  return (
    <div className="p-6 container flex flex-col items-start justify-start">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <ol className="list-reset flex text-gray-500">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">
              Dashboard
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Добавить заказ</li>
        </ol>
      </nav>

      {/* Order Form Section */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md md:w-3/5">
        <h2 className="text-lg font-bold mb-4">Добавить заказ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="trackCode" className="block text-gray-700 font-medium">
              Код отслеживания
            </label>
            <input
              type="text"
              id="trackCode"
              name="trackCode"
              value={formData.trackCode}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите код отслеживания"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium">
              Цена
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите цену"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Название товара
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите название товара"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="weight" className="block text-gray-700 font-medium">
              Вес (кг)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите вес"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium">
              Количество
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите количество"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dateOfPayment" className="block text-gray-700 font-medium">
              Дата оплаты
            </label>
            <input
              type="number"
              id="dateOfPayment"
              name="dateOfPayment"
              value={formData.dateOfPayment}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите дату оплаты"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="deliveredDate" className="block text-gray-700 font-medium">
              Дата доставки
            </label>
            <input
              type="number"
              id="deliveredDate"
              name="deliveredDate"
              value={formData.deliveredDate}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите дату доставки"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="deliverTo" className="block text-gray-700 font-medium">
              Адрес доставки
            </label>
            <input
              type="text"
              id="deliverTo"
              name="deliverTo"
              value={formData.deliverTo}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите адрес доставки"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="receiventInChina" className="block text-gray-700 font-medium">
              Получатель в Китае
            </label>
            <input
              type="number"
              id="receiventInChina"
              name="receiventInChina"
              value={formData.receiventInChina}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите получателя в Китае"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="paid" className="block text-gray-700 font-medium">
              Оплачено
            </label>
            <input
              type="checkbox"
              id="paid"
              name="paid"
              checked={formData.paid}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Отменить
            </button>
          </div>
        </form>
      </div>

      {/* Search Order */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Поиск заказа по коду</h2>
        <div className="mb-4">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            placeholder="Введите код отслеживания для поиска"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Поиск
        </button>

        {order && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Данные заказа</h3>
            <pre>{JSON.stringify(order, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
