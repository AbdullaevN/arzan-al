import { useState, useEffect } from "react";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";
import { API } from "../../constants/api";

const InformationModal = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const navigate = useNavigate();

  const [client, setClient] = useState<any | null>(null);
  const clientId = localStorage.getItem("clientId") || "";

  const checkAuthorization = () => {
    const token = localStorage.getItem("token");
    const clientIdFromStorage = localStorage.getItem("clientId");

    if (!token || !clientIdFromStorage) {
      navigate("/login"); // Перенаправляем на страницу логина
      return false;
    }
    return true;
  };

  const fetchClient = async () => {
    if (!checkAuthorization()) return;

    try {
      const res = await API.get(`/api/orders/client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClient(res.data);
      console.log("Client data:", res.data);
    } catch (e: any) {
      if (e.response?.status === 401) {
        console.error("Unauthorized, redirecting to login.");
        navigate("/login"); // Если запрос вернул 401, перенаправляем на страницу логина
      } else {
        console.error("Error fetching client:", e);
      }
    }
  };

  // Вызывать fetchClient при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchClient();
    }
  }, [isOpen]);

  const handleCopy = () => {
    // Copy text to clipboard
    const clientText = client
      ? `${client.name}\n${client.phone}\n${client.address}`
      : "Нет данных";
    navigator.clipboard.writeText(clientText);

    // Show toast
    setToastVisible(true);

    // Hide toast after a delay
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Информация</h2>
        {client ? (
          <p className="mb-4">
            <strong>Имя:</strong> {client.name}
            <br />
            <strong>Телефон:</strong> {client.phone}
            <br />
            <strong>Город:</strong> {client.city}
            <br />
            <strong>Код:</strong> {client.clientId}
            <br />
            {/* <strong>Город:</strong> {client.city} */}
          </p>
        ) : (
          <p className="mb-4 text-gray-500">Загрузка данных клиента...</p>
        )}

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
