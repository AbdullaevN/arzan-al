import   { useState } from "react";

const AddOrder = () => {
  const [formData, setFormData] = useState({
    code: "",
    phoneNumber: "",
    weight: "",
    volume: "",
    description: "",
    category: "",
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Order added:", formData);
    // Здесь можно добавить логику отправки данных на сервер
  };

  const handleCancel = () => {
    setFormData({
      code: "",
      phoneNumber: "",
      weight: "",
      volume: "",
      description: "",
      category: "",
    });
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

      {/* File Upload Section */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md md:w-3/5">
        <h2 className="text-lg font-bold mb-4">Добавить заказ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 font-medium">
              Код
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите код"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 font-medium"
            >
              Номер телефона
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите номер телефона"
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
            <label htmlFor="volume" className="block text-gray-700 font-medium">
              Объем (м³)
            </label>
            <input
              type="number"
              id="volume"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите объем"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              Описание товара
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Введите описание"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium"
            >
              Категория товара
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            >
              <option value="">Выберите категорию</option>
              <option value="electronics">Электроника</option>
              <option value="furniture">Мебель</option>
              <option value="clothing">Одежда</option>
              <option value="other">Другое</option>
            </select>
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
    </div>
  );
};

export default AddOrder;
