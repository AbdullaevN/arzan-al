import React from "react";
import { Link } from "react-router-dom";

const ActionButtons: React.FC = () => {
  return (
    <div className="flex gap-4 mb-4">
      <Link to={'/unpaid'}>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
          Неоплаченные
        </button>
      </Link>

      <Link to={'/paid'}>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Оплаченные
        </button>
      </Link>
    </div>
  );
};

export default ActionButtons;
