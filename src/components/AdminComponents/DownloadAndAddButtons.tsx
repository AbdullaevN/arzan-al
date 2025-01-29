import React from "react";

interface DownloadAndAddButtonsProps {
  handleDownload: () => void;
  toggleModal: () => void;
}

const DownloadAndAddButtons: React.FC<DownloadAndAddButtonsProps> = ({ handleDownload, toggleModal }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <button onClick={handleDownload} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">
        Скачать
      </button>
      <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
        + Добавить
      </button>
    </div>
  );
};

export default DownloadAndAddButtons;
