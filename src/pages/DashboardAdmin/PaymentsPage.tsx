 
const PaymentsPage = () => {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <ol className="list-reset flex text-gray-500">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">
              Dashboard
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Оплата</li>
        </ol>
      </nav>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
          Выдача товаров
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
          Неоплаченные
        </button>
      </div>

      {/* Date Pickers */}
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Период</label>
          <input type="date" className="p-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 invisible">Hidden</label>
          <input type="date" className="p-2 border border-gray-300 rounded-lg" />
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Список оплаченных
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Дата</label>
          <input type="date" className="p-2 border border-gray-300 rounded-lg" />
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-6">
          Получить
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
          placeholder="Поиск"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Поиск
        </button>
      </div>

      {/* Recent Dates - Scrollable */}
      <div className="flex gap-2 overflow-x-auto mb-4 p-2 border-b">
        {[
          "2024-10-14", "2024-10-16", "2024-10-17", "2024-10-18", "2024-10-19",
          "2024-10-21", "2024-10-22", "2024-10-24", "2024-10-26", "2024-10-29",
          "2024-10-30", "2024-11-02", "2024-11-05", "2024-11-07"
        ].map((date) => (
          <button
            key={date}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            {date}
          </button>
        ))}
      </div>

      {/* Download Button and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">
          Данные за 2024-11-12: Скачать
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          + Добавить
        </button>
      </div>

      {/* Payment Table */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-md mb-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {["№", "Дата оплаты", "Код", "ФИ", "Оплатил?", "Сумма", "Вес", "Кол-во", "Удалить"].map((header) => (
                <th key={header} className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Placeholder for future rows */}
            <tr>
              {Array(9).fill("—").map((cell, idx) => (
                <td key={idx} className="py-3 px-4 border-b text-gray-700">{cell}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clients Count */}
        <div className="p-4 bg-blue-100 rounded-lg">
          <div className="text-sm text-gray-700">Кол-во клиентов: 0 шт</div>
          <div className="text-sm text-gray-700">Оплатил: 0 шт</div>
          <div className="text-sm text-gray-700">Осталось: 0 шт</div>
        </div>
        {/* Total Amount */}
        <div className="p-4 bg-green-100 rounded-lg">
          <div className="text-sm text-gray-700">Общая сумма: 0 сом</div>
          <div className="text-sm text-gray-700">Оплатил: 0 сом</div>
          <div className="text-sm text-gray-700">Осталось: 0 сом</div>
        </div>
        {/* Total Weight */}
        <div className="p-4 bg-yellow-100 rounded-lg">
          <div className="text-sm text-gray-700">Общий вес: 0.00 кг</div>
          <div className="text-sm text-gray-700">Оплатил за: 0.00 кг</div>
          <div className="text-sm text-gray-700">Осталось: 0.00 кг</div>
        </div>
        {/* Product Count */}
        <div className="p-4 bg-red-100 rounded-lg">
          <div className="text-sm text-gray-700">Кол-во товаров: 0 шт</div>
          <div className="text-sm text-gray-700">Оплачено за: 0 шт</div>
          <div className="text-sm text-gray-700">Осталось: 0 шт</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
