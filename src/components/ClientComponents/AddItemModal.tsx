import React, { useState } from 'react';
import { API } from '../../constants/api';





const AddItemModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void }) => {
  const [description, setDescription] = useState('');
  const [trackCode, setTrackCode] = useState('');
  // const [file, setFile] = useState<File | null>(null);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFile(e.target.files[0]);
  //   }
  // };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleTrackCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackCode(e.target.value);
  };

  const handleAdd = async  () => {
    // console.log('File:', file);
    console.log('Description:', description);
    closeModal();


    try{

      const res = await API.post('/api/orders/create',{
        
issued:false, price:0, name:description, createdDate:Date.now(), paid:false, weight:0, amount:1, dateOfPayment:0, deliveredDate:0,deliverTo:"Tokmok",receiventInChina:false, trackCode:trackCode
      })
      console.log(111,res);


    }catch(e){
      console.log(e);
      
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Добавить товар</h2>

        {/* File input */}
        {/* <div className="mb-6">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Загрузить фото</label>
          <input
            type="file"
            id="file"
             
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            onChange={handleFileChange}
          />
        </div> */}

        {/* Description input */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Трек код</label>
          <input
            type="text"
            id="description"
            // className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Введите трек код"
            value={trackCode}
            onChange={handleTrackCodeChange}
          />
        </div>



  {/* Description input */}
  <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
          <input
            type="text"
            id="description"
            // className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Введите описание"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>










        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out"
            onClick={closeModal}
          >
            Закрыть
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            onClick={handleAdd}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
