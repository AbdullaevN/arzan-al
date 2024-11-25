import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ImportPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]); // Holds the full table data from file
  const [extractedData, setExtractedData] = useState<{ weight: string; volume: string; cost: string }[]>([]); // Holds extracted data with cost
  const [file, setFile] = useState<File | null>(null); // Holds the file selected for upload
  const [pricePerKg, setPricePerKg] = useState<number>(); // Default price per kilogram in som

  useEffect(() => {
    const storedExtractedData = localStorage.getItem("trackData");
    const storedTableData = localStorage.getItem("tableData");
    const storedPrice = localStorage.getItem("price");
    console.log(storedPrice);
    
  
    console.log("Stored Price from localStorage:", storedPrice); // Debugging line
  
    if (storedExtractedData) {
      setExtractedData(JSON.parse(storedExtractedData));
    }
    
    if (storedTableData) {
      setTableData(JSON.parse(storedTableData));
    }
  
    // If price is stored in localStorage, use it
    if (storedPrice) {
      setPricePerKg(parseFloat(storedPrice));
    }
  }, []);
  

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }

    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "txt"].includes(fileType || "")) {
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

      const weightIndex = jsonData[0].indexOf("Вес");
      const volumeIndex = jsonData[0].indexOf("Объем");

      if (weightIndex === -1 || volumeIndex === -1) {
        alert("Не удалось найти столбцы 'Вес' или 'Объем'.");
        return;
      }

      const filteredData = jsonData.slice(1).filter(row => row[weightIndex] && row[volumeIndex]);

      const extractedData = filteredData.map((row) => {
        const weight = parseFloat(row[weightIndex]);
        const volume = row[volumeIndex];
        const cost = weight * pricePerKg; // Use pricePerKg from localStorage or default

        return {
          weight: row[weightIndex],
          volume: row[volumeIndex],
          cost: cost.toFixed(2),
        };
      });

      setExtractedData(extractedData);
      localStorage.setItem("trackData", JSON.stringify(extractedData));

      setTableData(jsonData);
      localStorage.setItem("tableData", JSON.stringify(jsonData));
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-image min-h-screen">
      <div className="p-6 container flex flex-col items-start justify-start">
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md md:w-3/5">
          <h2 className="text-lg font-semibold mb-4">Импорт трек-кодов</h2>
          <div className="mb-4">
            <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
              Загрузите файл с трек-кодами
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".xlsx, .xls, .txt"
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

        {extractedData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Данные из файла:</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">Вес</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">Объем</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 text-left rounded-sm">Стоимость (сом)</th>
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
      </div>
    </div>
  );
};

export default ImportPage;
