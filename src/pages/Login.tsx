import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../constants/api';

interface LoginProps {
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({ setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages
  
    // Check for admin credentials
    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('token', 'admin');
  
      setUserRole('admin');
      navigate('/dashboard'); // Navigate to the admin dashboard
    } else {
      // Proceed with client login via API
      try {
        const res = await API.post('/api/auth/login', {
          clientId: email,
          password: password,
        });
        console.log('API Response:', res);  // Log the response
  
        if (res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userRole', 'client');
          console.log('LocalStorage after saving:', localStorage.getItem('token'), localStorage.getItem('userRole'));
          if(  email==="admin"){
            localStorage.setItem('userRole', 'admin');
      // localStorage.setItem('token', 'admin');
            setUserRole('admin')
            navigate('/dashboard'); // Navigate to the client dashboard
            
          }else{
            setUserRole('client');
            navigate('/clientdash'); // Navigate to the client dashboard
          }
    
        } else {
          setErrorMessage('Invalid login credentials. Please try again.');
        }
      } catch (error) {
        setErrorMessage('Неверные учетные данные. Попробуйте еще раз.');
        console.error('Login error:', error);
      }
    }
  };
  

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('userRole');
  //   setUserRole(null);
  //   navigate('/login');
  // };

  return (
    <div className='bg-image'>

    <div className="flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Войти</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Логин</label>
            <input
              id="email"
              name="email"
             
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
              placeholder="Введите ваш логин"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300"
              placeholder="Введите ваш пароль"
            />
          </div>

          {/* Error Message Display */}
          {errorMessage && <p className="text-red-600 font-bold text-sm mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Войти
          </button>
          
          {/* Logout Button */}
          {/* <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button> */}
        </form>
        
        {/* Link to Register Page */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
           У вас нет аккаунта?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">Регистрация</Link>
          </p>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Login;
