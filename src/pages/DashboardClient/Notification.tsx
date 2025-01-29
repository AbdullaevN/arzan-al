interface NotificationProps {
  productName: string;
  clientName: string;
  trackCode: string;
  createdDate: string;
}

const Notification: React.FC<NotificationProps> = ({
  productName,
  clientName,
  trackCode,
  createdDate,
}) => {
  return (
    <div className="bg-red-600 p-4 mb-4 rounded-md shadow-md text-white">
      <h3 className="font-semibold text-lg">Неоплаченный заказ: <br /> {productName}</h3>
      <p>Клиент: {clientName}</p>
      <p>Трек-код: {trackCode}</p>
      <p>Дата заказа: {createdDate}</p>
      <p>Статус: Неоплачено</p>
    </div>
  );
};

export default Notification;
