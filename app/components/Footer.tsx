const Footer = () => {
  return (
    <footer className="bg-white shadow mt-20">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="#"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <p className="text-4xl font-extrabold cursor-pointer">
              Настан<span className="text-blue-500 font-semibold">.мк</span>
            </p>
          </a>
          <span className="block text-sm text-gray-500 sm:text-center  ">
            © 2024{" "}
            <a href="#" className="hover:underline">
              Настан.мк
            </a>
            . Сите права се резервирани.
          </span>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Заштита на лични податоци
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Контакт
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
