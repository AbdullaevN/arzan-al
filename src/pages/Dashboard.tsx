import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Welcome to the Dashboard</h2>
        <p className="text-center mb-4">You are logged in successfully!</p>
        <div className="flex justify-center">
          <button
            onClick={() => {
              // Log out by clearing localStorage
              localStorage.removeItem('isLoggedIn');
              navigate('/login');
            }}
            className="text-blue-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
