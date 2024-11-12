 
const IssueProductsPage = () => {
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
          <li>Выдать товары клиентам</li>
        </ol>
      </nav>

      {/* Warning Message */}
      <div className="text-red-600 font-semibold mb-4 text-center">
        Внимание! После сканирования заказ считается выполненным!
      </div>

      {/* Barcode Scanning Block */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6 flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-4">
          Сканируйте штрих кодов...
        </label>
        <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
          Завершить
        </button>
      </div>

      {/* Manual Code Entry */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6 md:w-3/5">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Или введите код:
        </label>
        <div className="flex items-center">
          <input
            type="text"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mr-2 md:w-autp"
            placeholder="Введите код"
          />
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
            Добавить
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Трек-код
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Состояние
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder for future rows */}
            <tr>
              <td className="py-3 px-4 border-b text-gray-700">—</td>
              <td className="py-3 px-4 border-b text-gray-700">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueProductsPage;
