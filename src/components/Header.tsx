import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';

import { FaBars, FaTimes } from 'react-icons/fa';

import Logo from './Logo';
import LoginBtn from './LoginBtn';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Effect to handle header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        // Scrolling down, hide header
        setIsVisible(false);
      } else {
        // Scrolling up, show header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Effect to handle body scroll behavior when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'unset'; // Allow scrolling
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navElements = [
    { name: 'Home', href: 'home' },
    { name: 'About', href: 'about' },
    { name: 'Pricing', href: 'pricing' },
    { name: 'Contact', href: 'contact' },
    { name: 'FAQs', href: 'faq' },
  ];

  return (
    <header
      className={`flex justify-between items-center px-6 md:px-16 py-4 drop-shadow-md hover:shadow-xl h-[80px] sticky top-0 z-30 transition-all duration-300 ${
        isVisible ? 'bg-white' : 'glass'
      }`}
    >
      {/* Logo */}
      <Logo />

      {/* Center Navigation */}
      <nav className={`hidden md:flex gap-8 items-center`}>
        {navElements.map((navItem, index) => (
          <ScrollLink
            key={index}
            to={navItem.href}
            smooth={true}
            duration={500}
            offset={-60}
            className="font-semibold hover:underline hover:underline-offset-4 cursor-pointer text-black"
          >
            {navItem.name}
          </ScrollLink>
        ))}
      </nav>

      {/* Login Button (right side) */}
      <div className="hidden md:block">
        <LoginBtn />
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          className="text-2xl focus:outline-none text-black"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <nav className="fixed top-0 right-0 w-3/4 h-full bg-white p-6 flex flex-col gap-6 z-50">
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="self-end text-2xl text-black"
            >
              <FaTimes />
            </button>
            <ul className="flex flex-col gap-6 items-center mt-10">
              {navElements.map((navItem, index) => (
                <li key={index}>
                  <ScrollLink
                    to={navItem.href}
                    onClick={closeMenu}
                    smooth={true}
                    duration={500}
                    offset={-60}
                    className="text-black text-lg font-semibold"
                  >
                    {navItem.name}
                  </ScrollLink>
                </li>
              ))}
              <li className="mt-6">
                <LoginBtn />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
