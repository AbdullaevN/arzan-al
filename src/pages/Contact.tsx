import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert('Сообщение отправлено!');
    setFormData({ name: '', email: '', message: '' }); // Сбросить форму после отправки
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Контакты</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Наши контакты</h2>
        <p className="text-gray-600">Мы всегда рады вашим вопросам! Свяжитесь с нами по любому из следующих способов:</p>
        <ul className="list-disc pl-5 mt-4 text-gray-700">
          <li>Телефон: +996500735000   W/B, Telegram
          </li>
          <li>Email: arzanalcargo@gmail.com </li>
          <li>Адрес: ул. Примерная, 123, Город, Страна</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Напишите нам</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Ваше имя</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Ваш email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700">Ваше сообщение</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg"
            //   rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Отправить сообщение
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
