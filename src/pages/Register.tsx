import React, { useState } from 'react';
import { API } from '../constants/api';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',  
    city: '', 
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // console.log(


  //   fetch('https://cargo-back.onrender.com/api/client')
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error('Error:', error))

  // );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null); // Reset response message before a new request

    try {
      const res = await API.post('/api/auth/registration', {
        clientId: formData.username,
        password: formData.password,
        phone: formData.phone,   
        city: formData.city, 
      });

      if (res.status === 200) {
        setResponseMessage('Регистрация успешна! Перенаправление на страницу входа...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);  
      }
    } catch (e) {
      console.error(e);
      setResponseMessage('Ошибка при регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-image'>
    <div className="flex items-center justify-center min-h-screen  py-10">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Код</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите код который был дан"
            className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
          />

<label htmlFor="city" className="block text-sm font-medium text-gray-700">Город</label>
<input
  type="text"
  name="city"
  value={formData.city}
  onChange={handleChange}
  placeholder="Введите ваш город"
  className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
/>


          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 ">Номер телефона</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Введите номер телефона"
            className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
          />

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

       {/* Response from the server */}
{responseMessage && (
  <p
    className={`text-center text-sm mt-4 ${
      responseMessage.includes('Ошибка') ? 'text-red-600 font-bold text-4xl' : 'text-green-500 font-bold text-4xl'
    }`}
  >
    {responseMessage}
  </p>
)}

        {/* Link to login page */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            У вас уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
</div>

  );
};

export default Register;
