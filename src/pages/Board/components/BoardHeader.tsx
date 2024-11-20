import Logo from '../../../components/Logo';
import UserDropdown from '../../../components/UserDropdown';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';

interface BoardHeaderProps {
  variant?: 'default' | 'detailed';
  boardName?: string;
  onEdit?: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
  variant = 'default',
  boardName,
  onEdit,
}) => {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-4xl mt-4 p-4 flex justify-between items-center rounded-md shadow-md glass fixed">
      {variant === 'default' && (
        <>
          <Logo />
          <UserDropdown />
        </>
      )}

      {variant === 'detailed' && (
        <>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900 gap-2 ml-4 hover:ml-2 hover:gap-4 transition-all duration-300"
          >
            <MdArrowBack size={24} />
            <span className="font-medium text-lg">Back</span>
          </button>
          <span className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {boardName}
            <button onClick={onEdit}>
              <FaRegEdit />
            </button>
          </span>
          <UserDropdown />
        </>
      )}
    </header>
  );
};

export default BoardHeader;
