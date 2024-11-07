import React, { useState } from 'react';
import logo from '../../assets/img/logo.png';  
import './header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
  };

  const userRole = localStorage.getItem("userRole");
  console.log(userRole, 'user role');
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <header>
      <div className="container px-4 py-7 text-black flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to={userRole === "admin" ? "/dashboard" : userRole === "client" ? "/dashboard" : "/login"}>
            <img src={logo} alt="Logo" className="w-28 h-20 mr-4 object-cover" />
          </Link>
        </div>

        {/* Empty middle space */}
        <div className="flex-grow"></div>

        {/* Menu Section */}
        <div className={`menu ${toggleMenu ? 'active' : ''}`}>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <li className="cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">Токмок</li>
            <li className="cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3 text-black">{userRole}</li>
            <li onClick={handleLogout} className="cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">Выход</li>
          </ul>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="cursor-pointer md:hidden">
          <span onClick={handleToggle} className="menu-icon flex items-center relative">
            <span className={`navicon ${toggleMenu ? 'active' : ''}`}></span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
