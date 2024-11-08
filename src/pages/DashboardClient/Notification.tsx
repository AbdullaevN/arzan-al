// Notification.tsx
 
const Notification = () => {
  return (
    <div className="bg-red-600 text-white  p-4 m-3 rounded-lg max-w-screen-md">
      <h3 className="text-white text-lg  font-normal mb-2">Счёт за доставку от 2024-11-07</h3>
      <p className=" text-white mb-1">Поступило заказов - 1 шт</p>
      <p className="text-white">Вес 1.4 кг, сумма к оплате 395сом</p>
    </div>
  );
};

export default Notification;
