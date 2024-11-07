import  { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    phone: '',
    warehouse: '',
    firstName: '',
    lastName: '',
    code: '',
    password: '',
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-4 py-10 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Номер телефона</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Введите номер телефона"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">Выберите склад</label>
          <select
            id="warehouse"
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            required
          >
            <option value="">Выберите склад</option>
            <option value="warehouse1">Склад 1</option>
            <option value="warehouse2">Склад 2</option>
            <option value="warehouse3">Склад 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Имя</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Введите ваше имя"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Фамилия</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Введите вашу фамилию"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Код</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Введите ваш код"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Введите пароль"
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Зарегистрироваться</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
