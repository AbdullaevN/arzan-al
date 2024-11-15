import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
//  import { RootState, AppDispatch } from '../store';
import { API } from '../constants/api';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({ username: '', password: '' });
  // const { status, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(registerUser(formData));
    try{
      const res = await API.post('/api/auth/registration',{
        clientId:formData.username,
        password:formData.password,
        phone:'0500737080'
      })
      console.log(111,res);
      
    }catch(e){
      console.error(e)
    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
    <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>

      <form onSubmit={handleSubmit}>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Логин</label>

      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Введите логин"
        className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

      />
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль"
        className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

      />
       <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Зарегистрироваться
          </button>
      {/* <button type="submit">Register</button> */}
      {/* {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>} */}
    </form>

      {/* <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
           
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

         {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
        
         
      </form> */}
      
      {/* Link to Register Page */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
         У вас уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  </div>
   
  );
};

export default Register;
