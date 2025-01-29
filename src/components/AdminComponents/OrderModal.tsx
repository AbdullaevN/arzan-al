import React from "react";

interface OrderModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  weight: string;
  setWeight: React.Dispatch<React.SetStateAction<string>>;
  totalSum: number;
  handleAdd: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isModalOpen,
  toggleModal,
  code,
  setCode,
  amount,
  setAmount,
  weight,
  setWeight,
  totalSum,
  handleAdd,
  addError, // Pass the error message as a prop
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Добавление заказа</h2>

        {addError && ( // Show the error message if it exists
          <div className="mb-4 text-sm text-red-500">
            {addError}
          </div>
        )}

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Код</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Количество</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Вес</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">Итог: {totalSum} </div>
            <div className="flex gap-2">
              
              <button
                type="button"
                onClick={toggleModal}
                className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Закрыть
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Добавить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


export default OrderModal;
