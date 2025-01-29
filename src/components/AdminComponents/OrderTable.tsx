import React, { useEffect } from "react";

interface Order {
  id: string;
  name: string;
  trackCode: string;
  amount: number;
  weight: number;
  price: number;
  dateOfPayment: number | null;
  paid: boolean;
  clientId: string;
}

interface OrderTableProps {
  orders: Order[];
  filterOrders: Order[];
  handlePaid: (order: Order) => void;
  handleDelete: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, handlePaid, handleDelete }) => {
  // useEffect(() => {
  //   console.log("Filtered orders passed to the table:", orders);
  // }, [orders]);

  const filterOrders2 = orders.filter(order => order.amount > 0 && order.weight > 0);
  // console.log(orders,'77');
  

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-md mb-6 overflow-x-auto flex text-center">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {/* Headers */}
          </tr>
        </thead>
        <tbody>
            {filterOrders2.length > 0 ? (
              filterOrders2.map((order, idx) => (
                <tr key={order.id}>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.dateOfPayment
                      ? new Date(order.dateOfPayment).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.name}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.clientId}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.amount}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.weight}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {order.price}
                  </td>
               
                 
                  <td className="py-3 px-4 border-b text-gray-700 gap-4 flex flex-row  items-end justify-end">
  <button
    className={`font-semibold py-2 px-4 rounded-lg ${
      order.paid
        ? "bg-green-500 text-white cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
    disabled={order.paid} // Кнопка отключается, если заказ уже оплачен
    onClick={() => handlePaid(order)} // Вызывается функция handlePaid
  >
    {order.paid ? "Оплачено" : "Оплатить"} {/* Динамическая метка */}
  </button>

  <button
    className={`font-semibold py-2 px-4 rounded-lg text-white   bg-red-500 hover:bg-red-600 text-white"
    }`}
    // disabled={order.paid} // Кнопка отключается, если заказ уже оплачен
    onClick={() => handleDelete(order)} // Вызывается функция handlePaid
  >
   Удалить
  </button>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-3 px-4 text-center border-b text-gray-700"
                >
                  Нет заказов для выбранной даты
                </td>
              </tr>
            )}
          </tbody>
      </table>
    </div>
  );
};


export default OrderTable;
