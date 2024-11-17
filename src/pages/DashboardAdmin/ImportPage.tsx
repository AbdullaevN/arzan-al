import React, { useState } from "react";
import * as XLSX from "xlsx";

const ImportPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]); // Указываем тип состояния

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        setTableData(jsonData); // Устанавливаем данные
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="p-6 container flex flex-col items-start justify-start">
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
          <li>Импорт</li>
        </ol>
      </nav>

      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md md:w-3/5">
        <h2 className="text-lg font-semibold mb-4">Импорт трек-кодов</h2>
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Загрузите файл с трек-кодами
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .txt"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            onChange={handleFileUpload}
          />
        </div>
        <button className="w-auto px-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
          Загрузить
        </button>
      </div>

      <div className="mt-4 text-gray-500 text-sm">
        <p>* Максимум 900 трек, если больше, разделите по частям и снова импортируйте.</p>
        <p className="mt-2">! Пример:</p>
        <p>
          Трек коды должны быть размещены начиная с первого столбца (A), и файл должен быть в
          формате .xlsx или .txt.
        </p>
      </div>

      {tableData.length > 0 && (
        <div className="mt-6 w-full overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {tableData[0].map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 bg-gray-100 text-left"
                  >
                    {header || "Колонка " + (index + 1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {cell || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
