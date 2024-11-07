import React, { useState } from 'react';

export const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    description: '',
    image: null,
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e:any) => {
    setOrderData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Логика отправки данных на сервер или сохранения заказа
    console.log(orderData);
    // Очистка формы
    setOrderData({ description: '', image: null });
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <label>
        Описание заказа:
        <textarea
          name="description"
          value={orderData.description}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Добавьте фото:
        <input type="file" onChange={handleImageChange} />
      </label>

      <button type="submit">Создать заказ</button>
    </form>
  );
};
