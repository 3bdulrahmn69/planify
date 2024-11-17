import React, { useRef, useEffect, ReactNode } from 'react';
import { cn } from '../lib/utils';
import { HiOutlineDotsVertical } from 'react-icons/hi';

// DropdownItem Component
interface DropdownItemProps {
  onClick: () => void;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export const DropdownItem = ({
  children,
  onClick,
  onClose,
  className,
}: DropdownItemProps) => {
  const handleClick = () => {
    onClick();
    onClose();
  };

  return (
    <li>
      <button
        className={cn(
          'w-full px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2',
          className
        )}
        onClick={handleClick}
      >
        {children}
      </button>
    </li>
  );
};

// DropdownMenu Component
interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export const DropdownMenu = ({
  isOpen,
  onClose,
  className,
  children,
}: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null; // Return null if the menu is not open

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute top-8 right-0 w-48 bg-white border text-black border-gray-300 rounded-md shadow-lg z-10',
        className
      )}
    >
      <ul className="py-2">
        {React.Children.map(children, (child) =>
          // Pass the onClose function to each DropdownItem child
          child &&
          typeof child === 'object' &&
          'type' in child &&
          child.type === DropdownItem
            ? React.cloneElement(child, { onClose })
            : child
        )}
      </ul>
    </div>
  );
};

// DropdownButton Component

interface DropdownButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  className?: string;
}

export const DropdownButton = ({
  isMenuOpen,
  setIsMenuOpen,
  className,
}: DropdownButtonProps) => {
  return (
    <button
      onClick={() => {
        setIsMenuOpen(!isMenuOpen);
      }}
      className={cn(
        'p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors',
        className
      )}
    >
      <HiOutlineDotsVertical />
    </button>
  );
};
