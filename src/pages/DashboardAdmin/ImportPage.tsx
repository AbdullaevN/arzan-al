import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ImportPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]); // Holds the full table data from file
  const [extractedData, setExtractedData] = useState<{ weight: string; volume: string; cost: string }[]>([]); // Holds extracted data with cost
  const [file, setFile] = useState<File | null>(null); // Holds the file selected for upload
  const pricePerKg = 300; // Fixed price per kilogram in som

  useEffect(() => {
    const storedExtractedData = localStorage.getItem("trackData");
    const storedTableData = localStorage.getItem("tableData");

    if (storedExtractedData) {
      setExtractedData(JSON.parse(storedExtractedData)); // Retrieve saved data from localStorage
      console.log("Extracted Data from localStorage:", JSON.parse(storedExtractedData)); // Log data
    }
    
    if (storedTableData) {
      setTableData(JSON.parse(storedTableData)); // Retrieve full table data from localStorage
      console.log("Full Table Data from localStorage:", JSON.parse(storedTableData)); // Log data
    }
  }, []);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Update the file state with the selected file
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }

    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "xlsx" && fileType !== "txt" && fileType !== "xls") {
      alert("Поддерживаются только файлы с расширением .xlsx, .xls или .txt.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      // Log the parsed table data
      console.log("Parsed Table Data:", jsonData);

      // Extract columns "Вес" and "Объем"
      const weightIndex = jsonData[0].indexOf("Вес");
      const volumeIndex = jsonData[0].indexOf("Объем");

      if (weightIndex === -1 || volumeIndex === -1) {
        alert("Не удалось найти столбцы 'Вес' или 'Объем'.");
        return;
      }

      const filteredData = jsonData.slice(1).filter(row => row[weightIndex] && row[volumeIndex]);

      // Calculate costs based on weight
      const extractedData = filteredData.map((row) => {
        const weight = parseFloat(row[weightIndex]);
        const volume = row[volumeIndex];
        const cost = weight * pricePerKg;

        return {
          weight: row[weightIndex],
          volume: row[volumeIndex],
          cost: cost.toFixed(2), // Ensure cost is shown with 2 decimal places
        };
      });

      setExtractedData(extractedData);
      localStorage.setItem("trackData", JSON.stringify(extractedData)); // Save extracted data in localStorage
      console.log("Extracted Data with Costs -WEIGHT:", extractedData); // Log the extracted data

      setTableData(jsonData); // Store the full table data as well
      localStorage.setItem("tableData", JSON.stringify(jsonData)); // Save full table data to localStorage
    };

    reader.readAsArrayBuffer(file);
  };
  console.log(extractedData.map((i)=>i.weight ),'111');
  

  return (
    <div className="bg-image min-h-screen">
      <div className="p-6 container flex flex-col items-start justify-start">
        <nav className="text-sm mb-4">
          <ol className="list-reset flex text-gray-500">
            <li>
              <a href="/dashboard" className="text-blue-500 hover:underline">Главная</a>
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
            <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
              Загрузите файл с трек-кодами
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".xlsx, .txt, .xls"
              className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              onChange={handleFileSelection}
            />
          </div>
          <button
            onClick={handleFileUpload}
            className="w-auto px-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
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

        {extractedData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Данные из файла:</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">
                    Вес
                  </th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">
                    Объем
                  </th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">
                    Стоимость (сом)
                  </th>
                </tr>
              </thead>
              <tbody>
                {extractedData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-4 py-2">{row.weight}</td>
                    <td className="border border-gray-400 px-4 py-2">{row.volume}</td>
                    <td className="border border-gray-400 px-4 py-2">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tableData.length > 0 && (
          <div className="mt-6 w-full overflow-x-auto bg-gray-300">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {tableData[0].map((header, index) => (
                    <th key={index} className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">
                      {header || `Колонка ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-400 px-4 py-2">{cell || ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;
