 
const ImportIssuedProductsPage = () => {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <ol className="list-reset flex text-gray-500">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">
            Главная
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>Импорт выданных товаров</li>
        </ol>
      </nav>

      {/* File Upload Section */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4">Импорт выданных товаров</h2>
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Загрузите файл с данными о выданных товарах
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .txt"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
          Загрузить
        </button>
      </div>

      {/* Instructional Text */}
      <div className="mt-4 text-gray-500 text-sm">
        <p>* Максимум 900 записей, если больше, разделите по частям и снова импортируйте.</p>
        <p className="mt-2">! Пример:</p>
        <p>
          Данные должны быть размещены начиная с первого столбца (A), и файл должен быть в формате .xlsx или .txt.
        </p>
      </div>
    </div>
  );
};

export default ImportIssuedProductsPage;
