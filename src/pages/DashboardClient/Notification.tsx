interface NotificationProps {
  productName: string;
  clientName: string;
  trackCode: string;
  createdDate: string;
  weight: string;
  price: string;
}

const Notification: React.FC<NotificationProps> = ({
  productName,
  clientName,
  trackCode,
  createdDate,
  weight,
  price
}) => {
  return (
    <div className='bg-red-500 border border-red-400 text-white-700 px-4 py-3 rounded relative mb-2'>
      <p><strong>{productName}</strong></p>
      <p>Клиент: {clientName}</p>
      <p>Трек-номер: {trackCode}</p>
      <p>Дата: {createdDate}</p>
      <p>Вес: {weight}</p>
      <p>Цена: {price}</p>
    </div>
  );
};

export default Notification;
