import { Link } from 'react-router-dom';

import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="Planify Home"
      className="w-fit flex items-center hover:opacity-90 transition-opacity duration-300"
    >
      <img src={logo} alt="Planify logo" className="w-8 h-8 md:w-16 md:h-16" />
      <p className="text-lg md:text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Planify
      </p>
    </Link>
  );
};

export default Logo;
