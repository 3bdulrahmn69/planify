import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Context/FakeAuthContext';
import LogoutBtn from './LogoutBtn';

import { IoIosArrowDown } from 'react-icons/io';

const UserDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-4 cursor-pointer bg-gray-200 px-2 py-1 rounded-md"
      >
        <p>{user?.name}</p>
        <img src={user?.avatar} alt="user" className="w-8 h-8 rounded-full" />

        <div
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <IoIosArrowDown />
        </div>
      </div>

      <div
        className={`absolute right-0 mt-2 bg-white border rounded-lg shadow-lg transition-all duration-200 ease-out transform ${
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <LogoutBtn variant="text" />
      </div>
    </div>
  );
};

export default UserDropdown;
