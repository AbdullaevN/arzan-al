// src/components/AdminComponents/Statistics.tsx
import React from "react";

interface Stats {
  clientsCount: number;
  paidClients: number;
  remainingClients: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  totalWeight: number;
  paidWeight: number;
  remainingWeight: number;
  productCount: number;
  paidProducts: number;
  remainingProducts: number;
}

interface StatisticsProps {
  stats: Stats;
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-bold text-xl">
      {/* Clients Count */}
      <div className="p-4 bg-blue-300 rounded-lg">
        <div className="text-sm text-gray-700">Кол-во клиентов: {stats.clientsCount || 0} шт</div>
        <div className="text-sm text-gray-700">Оплатил: {stats.paidClients || 0} шт</div>
        <div className="text-sm text-gray-700">Осталось: {stats.remainingClients || 0} шт</div>
      </div>

      {/* Total Amount */}
      <div className="p-4 bg-green-300 rounded-lg">
        <div className="text-sm text-gray-700">Общая сумма: {stats.totalAmount || 0} сом</div>
        <div className="text-sm text-gray-700">Оплатил: {stats.paidAmount || 0} сом</div>
        <div className="text-sm text-gray-700">Осталось: {stats.remainingAmount || 0} сом</div>
      </div>

      {/* Total Weight */}
      <div className="p-4 bg-yellow-300 rounded-lg">
        <div className="text-sm text-gray-700">Общий вес: {(stats.totalWeight || 0).toFixed(2)} кг</div>
        <div className="text-sm text-gray-700">Оплатил за: {(stats.paidWeight || 0).toFixed(2)} кг</div>
        <div className="text-sm text-gray-700">Осталось: {(stats.remainingWeight || 0).toFixed(2)} кг</div>
      </div>

      {/* Product Count */}
      <div className="p-4 bg-red-300 rounded-lg">
        <div className="text-sm text-gray-700">Кол-во товаров: {stats.productCount || 0} шт</div>
        <div className="text-sm text-gray-700">Оплачено за: {stats.paidProducts || 0} шт</div>
        <div className="text-sm text-gray-700">Осталось: {stats.remainingProducts || 0} шт</div>
      </div>
    </div>
  );
};

export default Statistics;
