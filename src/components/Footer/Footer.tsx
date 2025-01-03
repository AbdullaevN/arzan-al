
const Footer = () => {
  return (
    <footer className="bg-bgBlue text-black py-4">
      <div className="container mx-auto px-4 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-between items-center text-center   md:space-y-0 gap-2 md:gap-20 md:place-items-baseline">
 

          <div className="text-center md:text-left text-black font-bold">
            <p>&copy; 2024 Arzanal</p>
          </div>

          <div className="flex justify-center space-x-4 ">
       
            <a href="https://www.instagram.com/arzanal.kemin" className="hover:text-gray-500" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>

          <div className="text-center md:text-right">
            <a href="/contact" className="hover:text-gray-500">Контакты</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
