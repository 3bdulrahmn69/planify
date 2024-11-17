import { cn } from '../../../lib/utils';
import { FiPlusCircle } from 'react-icons/fi';

interface CreateBtnProps {
  onClick: () => void;
  title: string;
  className?: string;
}

const CreateBtn = ({ onClick, title, className }: CreateBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full bg-blue-500 text-white py-2 px-4 mb-2 rounded-lg flex justify-between items-center',
        'hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105',
        className
      )}
    >
      <span className="text-sm font-medium">{title}</span>
      <FiPlusCircle className="text-2xl ml-2 transform transition-transform duration-200 group-hover:scale-125 group-hover:rotate-45" />
    </button>
  );
};

export default CreateBtn;
