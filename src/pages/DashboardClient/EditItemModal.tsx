import { useState, useEffect } from "react";
import { API } from "../../constants/api";
import { useClientStore } from "../../store/useClient";

  
interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void; // Callback to update the parent component
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get clientId from localStorage or Zustand
  const clientId = useClientStore((state) => state.clientId) || localStorage.getItem("clientId");

  // Handle changes in input fields
  const handleChange = (field: keyof Order, value: any) => {
    setEditedOrder({ ...editedOrder, [field]: value });
  };

  const handleSave = async () => {
    if (!clientId) {
      setError("Client ID is missing.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
       const updatedOrder = {
        ...editedOrder,
        clientId, 
      };
  
      // Making the PUT request to the backend with the updated order and clientId
      const response = await API.put(`/api/orders/edit/${editedOrder.trackCode}`, {
  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder), // Properly sending the JSON body
      });
  
      if (!response.ok) {
        throw new Error("Failed to update the order");
      }
  
      const result = await response.json();
      onSave(result); // Call the onSave function from the parent component to update the order list
      onClose(); // Close the modal
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Disable loading state after request completes
    }
  };
  

  useEffect(() => {
    // Optionally, you can check if the clientId exists when the modal is opened
    if (!clientId) {
      setError("Client ID is not available.");
    }
  }, [clientId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold">Редактировать заказ</h3>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4">
          <label>Имя</label>
          <input
            type="text"
            value={editedOrder.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
          />
        </div>
        {/* Add other fields to edit as needed */}
        <div className="mt-4 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading && "opacity-50 cursor-not-allowed"}`}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
