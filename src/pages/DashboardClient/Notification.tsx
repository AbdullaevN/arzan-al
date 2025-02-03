import { useEffect } from "react";
import usePriceStore from "../../store/useClient";

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
  price,
}) => {
  const { price: servicePrice, fetchPrice } = usePriceStore();
    
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  const calculateTotalPrice = () => {
    const productPrice = parseFloat(price);
    if (isNaN(productPrice) || !servicePrice) return null;
    
    return productPrice * servicePrice;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className='bg-red-500 border border-red-400 text-white px-4 py-3 rounded relative mb-2'>
      {/* <p><strong>{productName}</strong></p> */}
      <p><strong> Счёт за доставку от {createdDate} </strong></p>

      <p className="text-base">Клиент: {clientName}</p>
      {/* <p>Трек-номер: {trackCode}</p> */}
      {/* <p>Дата: {createdDate}</p> */}
      <p className="text-base">Вес: {weight}</p>
      <p className="text-base">Цена товара: {price} $</p>
      <p className="text-base">
        Итоговая цена: {
          totalPrice 
            ? `${totalPrice.toFixed()} ` 
            : 'Рассчет недоступен'
        }
      </p>
    </div>
  );
};

export default Notification;