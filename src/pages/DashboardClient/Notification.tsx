interface NotificationProps {
  totalOrders: number;
  totalWeight: number;
  totalAmount: number;
}

const Notification: React.FC<NotificationProps> = ({ totalOrders, totalWeight, totalAmount }) => {
  return (
    <div className="bg-red-600 text-white p-4 m-3 rounded-lg max-w-screen-md">
      <h3 className="text-white text-lg font-normal mb-2">Счёт за доставку от 2024-11-07</h3>
      <p className="text-white mb-1">Поступило заказов - {totalOrders} шт</p>
      <p className="text-white">Вес {totalWeight} кг, сумма к оплате {totalAmount} сом</p>
    </div>
  );
};

export default Notification;
