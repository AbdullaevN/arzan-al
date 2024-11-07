import   { useState, useEffect } from 'react';

interface Order {
  id: string;
  description: string;
  completedAt: string;
  status: string;
}

export const Archive = () => {
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const archived = localStorage.getItem('archivedOrders');
    // Если в localStorage ничего нет, возвращаем пустой массив
    const parsedOrders = archived ? JSON.parse(archived) : [];
    setArchivedOrders(parsedOrders);
  }, []);

  return (
    <div className="archive">
      <h2>Архив заказов</h2>
      <ul>
        {archivedOrders.map((order) => (
          <li key={order.id}>
            <p>Описание: {order.description}</p>
            <p>Дата завершения: {order.completedAt}</p>
            <p>Статус: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
