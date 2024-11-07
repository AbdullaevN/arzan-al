import React, { useState } from 'react';
import logo from '../../assets/img/logo.png'; // Import the logo image
import './header.css';

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
  };

  return (
    <header>
      <div className="px-4 py-2 text-white flex justify-between items-center bg-blue-900">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mr-4" />
         </div>
        <div
          className={toggleMenu ? 'md:flex md:pt-0 pt-10 w-full md:w-auto' : 'hidden md:flex'}
          id="menu"
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <li className="cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">
              Home
            </li>
            <li className="dropdown cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3 relative">
              <a>Products</a>
            </li>
            <li className="cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">
              About Us
            </li>
            <li className="cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">
              Contact Us
            </li>
          </ul>
        </div>
        <div className="cursor-pointer md:hidden">
          <label
            className="menu-icon block cursor-pointer md:hidden px-2 py-4 relative select-none"
            htmlFor="menu-btn"
          >
            <span onClick={handleToggle} className="navicon flex items-center relative"></span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;
