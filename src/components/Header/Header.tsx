import { useState } from 'react';
import logo from '../../assets/img/logo.png';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();



  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUserRole(null);
    navigate('/login');
  };

  // Close the menu when a link is clicked
  const handleMenuClick = () => {
    setToggleMenu(false);
  };

  return (
    <header>
      <div className="container px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center justify-center w-full md:w-auto">
          <Link to={userRole === 'admin' ? '/dashboard' : userRole === 'client' ? '/clientdash' : '/login'}>
            <img src={logo} alt="Logo" className="w-48 h-32 object-cover" loading="lazy"/>
          </Link>
        </div>

         
        <div className="flex-grow"></div>

        
        <div className={`menu ${toggleMenu ? 'active' : ''}`}>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">

            {/* <li onClick={handleMenuClick} className="text-white cursor-pointer hover:text-amber-500 border-b md:border-none py-2 px-3 text-xl font-bold">Токмок</li> */}

            {userRole && (
              <li onClick={handleMenuClick} className="text-black cursor-pointer hover:text-amber-500 border-b md:border-none py-2 px-3 text-xl font-bold">{userRole}</li>
            )}

            <li onClick={() => { handleLogout(); handleMenuClick(); }} className="text-black cursor-pointer hover:text-amber-500 border-b md:border-none py-2 px-3 text-xl font-bold">Выход</li>
          </ul>
        </div>
        

        {/* Hamburger Icon */}
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
