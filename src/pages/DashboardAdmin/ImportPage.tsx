import React, { useState } from "react";
import * as XLSX from "xlsx";
import { API } from "../../constants/api";

interface OrderData {
  timestamp: number;
  paid: boolean;
  price: number;
  weight: number;
  clientId: string;
  trackCodes: string[];
  amount: number;
}

const ImportPage = () => {
  const [tableData, setTableData] = useState<OrderData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isFileLoaded, setIsFileLoaded] = useState(false);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsFileLoaded(false);
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
      const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

      const clientData: OrderData[] = [];
      let currentClientId = "";
      let currentTrackCodes: string[] = [];
      let currentWeight = 0;
      let currentPrice = 0;

      jsonData.forEach((row) => {
        if (row[0]) {
          // Новый клиент
          if (currentClientId) {
            clientData.push({
              clientId: currentClientId,
              trackCodes: currentTrackCodes,
              weight: currentWeight,
              price: currentPrice,
              timestamp: Date.now(),
              paid: false,
              amount: currentPrice * currentWeight,
            });
          }
          currentClientId = row[0].toString();
          currentTrackCodes = [];
          currentWeight = parseFloat(row[2]?.toString().replace(",", ".")) || 0;
          currentPrice = parseFloat(row[3]?.toString().replace(",", ".")) || 0;
        }
        if (row[1]) {
          currentTrackCodes.push(row[1].toString());
        }
      });

      if (currentClientId) {
        clientData.push({
          clientId: currentClientId,
          trackCodes: currentTrackCodes,
          weight: currentWeight,
          price: currentPrice,
          timestamp: Date.now(),
          paid: false,
          amount: currentPrice * currentWeight,
        });
      }

      console.log("Обработанные данные клиентов:", clientData);
      setTableData(clientData);
      setIsFileLoaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

 
  const handleSubmit = async () => {
    if (!isFileLoaded) {
      alert("Пожалуйста, загрузите файл перед отправкой.");
      return;
    }
  
    const requestData = tableData.map((item) => ({
      clientId: item.clientId,
      trackCodes: item.trackCodes,
      price: item.price,
      weight: item.weight,
      timestamp: Date.now(),
    }));
  
    try {
      // const res = await API.put("/api/orders/import", requestData);
      const res = await API.put("/api/orders/import", {
        file: requestData, 
      });
  
      console.log("Данные успешно отправлены на сервер:", res.data);
  
      // Очистка данных после успешной отправки
      setFile(null);
      setTableData([]);
      setIsFileLoaded(false);
      alert("Данные успешно отправлены!");
    } catch (error) {
      console.error("Ошибка при отправке данных:", error.response?.data || error.message);
      
      alert(`Ошибка: ${error.response?.data?.message || "Не удалось отправить данные."}`);
    }
  };
  
  

  return (
    <div className="bg-image min-h-screen">
      <div className="p-6 container md:mx-auto flex flex-col items-start justify-start">
        <h2 className="text-lg font-semibold mb-4">Импорт трек-кодов</h2>
        <div className="mb-4">
          <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
            Загрузите файл
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
          onClick={isFileLoaded ? handleSubmit : handleFileUpload}
          className="w-auto px-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          {isFileLoaded ? "Отправить" : "Загрузить"}
        </button>

        {tableData.length > 0 && (
          <div className="mt-6 bg-slate-200">
            <h3 className="text-lg font-semibold mb-4">Данные из файла:</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Client ID</th>
                  <th className="border border-gray-400 px-4 py-2">Track Codes</th>
                  <th className="border border-gray-400 px-4 py-2">Weight</th>
                  <th className="border border-gray-400 px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) =>
                  row.trackCodes.map((trackCode, subIndex) => (
                    <tr key={`${index}-${subIndex}`}>
                      <td className="border border-gray-400 px-4 py-2">
                        {subIndex === 0 ? row.clientId : ""}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">{trackCode}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        {subIndex === 0 ? row.weight.toFixed(2) : ""}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {subIndex === 0 ? row.price.toFixed(2) : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;
