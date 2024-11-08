import { useState } from "react";
import Toast from "./Toast";

const InformationModal = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = () => {
    // Copy text to clipboard
    navigator.clipboard.writeText(
      "赛字母BBK-BBK-146 18047077231 广东省广州市白云区江高镇南岗三元南路62号安托仓储1119库房"
    );

    // Show toast
    setToastVisible(true);

    // Hide toast after a delay
    setTimeout(() => {
      setToastVisible(false);
    }, 2000); // Adjust the duration of the toast visibility (in milliseconds)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Информация</h2>
        <p className="mb-4">
          赛字母BBK-BBK-146
          <br />
          18047077231
          <br />
          广东省广州市白云区江高镇南岗三元南路62号安托仓储1119库房
          <br />
          赛字母BBK-BBK-146
        </p>

        <div className="flex gap-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={closeModal}
          >
            Закрыть
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleCopy}
          >
            Копировать
          </button>
        </div>
      </div>

      {/* Display Toast message */}
      <Toast message="Текст скопирован!" isVisible={toastVisible} />
    </div>
  );
};

export default InformationModal;
