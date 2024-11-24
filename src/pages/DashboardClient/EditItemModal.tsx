import { useState } from "react";

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void; // Обновление заказа в родительском компоненте
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof Order, value: any) => {
    setEditedOrder({ ...editedOrder, [field]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/edit/${editedOrder.trackCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedOrder),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить заказ");
      }

      const updatedOrder = await response.json();
      onSave(updatedOrder);  // Обновляем родительский компонент с новым заказом
      onClose();  // Закрываем модал
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Добавьте другие поля для редактирования */}
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
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
