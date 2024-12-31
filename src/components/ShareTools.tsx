import { ReactNode } from 'react';
import { IoMdShare } from 'react-icons/io';
import { cn } from '../lib/utils';

// Share component to toggle visibility and pass in dynamic content (ShareButton)
interface ShareProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Share = ({ isOpen, children, className, onClick }: ShareProps) => {
  return (
    <div className={cn('relative z-30', className)}>
      <IoMdShare
        onClick={onClick}
        className="cursor-pointer bg-black text-white rounded-full p-2 text-4xl transition-transform transform hover:scale-110"
      />

      <div
        className={cn(
          'absolute top-12 right-0  transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};

// ShareButton component to handle individual button actions
interface ShareButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ShareButton = ({
  children,
  className,
  onClick,
}: ShareButtonProps) => {
  return (
    <button
      className={cn('bg-blue-500 text-white px-4 py-2 rounded-lg', className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
