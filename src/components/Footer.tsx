import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import Logo from './Logo';

const Footer = () => {
  const date = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) {
      // Simulate subscribing action
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-800 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* Company Info */}
        <div className="space-y-4">
          <Logo />
          <p className="text-sm">
            Planify is a task management app that helps you organize your day
            and plan your week efficiently.
          </p>
        </div>

        {/* Features & Links */}
        <div className="flex flex-wrap justify-between lg:justify-around w-full space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="space-y-1">
              <li>Task Management</li>
              <li>Weekly Planner</li>
              <li>Priority Levels</li>
              <li>Due Dates</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            <ul className="space-y-1">
              <li>Blog</li>
              <li>Help Center</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Company</h3>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>

        {/* Connect and Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connect with Us</h3>
          <ul className="flex space-x-4">
            <li>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-slate-400"
              >
                <FaFacebook size={20} />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter" className="hover:text-slate-400">
                <FaTwitter size={20} />
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-slate-400"
              >
                <FaInstagram size={20} />
              </a>
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 w-full lg:w-2/3 text-black rounded-l-md focus:outline-none"
              />
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 bg-slate-600 text-white rounded-r-md hover:bg-slate-500"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-slate-600 my-6" />

      <div className="flex flex-col lg:flex-row justify-between items-center text-sm px-4">
        <p>
          &copy; {date} <span className="font-bold">Planify</span>. All Rights
          Reserved.
        </p>
        <div className="flex space-x-4 mt-4 lg:mt-0">
          <a href="#" className="hover:text-slate-400">
            Terms & Conditions
          </a>
          <a href="#" className="hover:text-slate-400">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
