 
const ContactPage = () => {
 
 

  return (
    <div className="container mx-auto p-6 flex flex-col items-start min-h-screen justify-start">
      <h1 className="text-3xl font-bold mb-6 text-center">Контакты</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Наши контакты</h2>
        <p className="text-gray-600">Мы всегда рады вашим вопросам! Свяжитесь с нами по любому из следующих способов:</p>
        <ul className="list-disc pl-5 mt-4 text-gray-700">
          <li>Телефон: +996500735000   W/B, Telegram
          </li>
          <li>Email: arzanalcargo@gmail.com </li>
         </ul>
      </div>

 
    </div>
  );
};

export default ContactPage;
