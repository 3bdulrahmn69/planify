import { cn } from '../lib/utils';
import { FaPlus } from 'react-icons/fa';

interface PlusButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const PlusButton = ({
  title,
  onClick,
  className,
  size = 'medium',
}: PlusButtonProps) => {
  const sizeClasses = {
    small: 'p-1 text-lg',
    medium: 'p-2 text-xl',
    large: 'p-3 text-2xl',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full gradient-text text-blue-500 bg-white shadow-lg border hover:scale-105 transition-transform',
        sizeClasses[size],
        className
      )}
      title={title}
    >
      <FaPlus />
    </button>
  );
};

export default PlusButton;
