import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  return (
    <nav className="text-sm mb-4">
      <ol className="list-reset flex text-gray-500 text-lg">
        <li>
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            Главная
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>Оплата</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
