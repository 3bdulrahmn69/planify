import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardContext } from '../../../Context/DashboardContext';
import {
  DropdownItem,
  DropdownMenu,
  DropdownButton,
} from '../../../components/DropdownMenu';
import { Modal, ModalInput, ModalButton } from '../../../components/Modal';

import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { MdDraw, MdTaskAlt } from 'react-icons/md';

interface BoardCardProps {
  name: string;
  id: string;
  type: string;
  date: string;
}

const BoardCard = ({ name, id, date, type }: BoardCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tempBoardName, setTempBoardName] = useState(name);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const { dispatch } = useDashboardContext();

  const handleDeleteBoard = () => {
    dispatch({ type: 'DELETE_BOARD', payload: { id } });
  };

  const handleRenameBoard = () => {
    if (tempBoardName.trim()) {
      dispatch({
        type: 'RENAME_BOARD',
        payload: { id, newName: tempBoardName.trim() },
      });
      setIsBoardModalOpen(false);
    }
  };

  return (
    <div className="relative h-56 w-full max-w-md sm:w-96 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 overflow-hidden">
      {/* Dropdown Button */}
      <DropdownButton
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        aria-label="Options"
        className="absolute top-4 right-4 z-10"
      />

      {/* Dropdown Menu */}
      <DropdownMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <DropdownItem
          onClick={() => setIsBoardModalOpen(true)}
          onClose={() => setIsMenuOpen(false)}
        >
          <FaRegEdit />
          <span>Rename</span>
        </DropdownItem>
        <DropdownItem
          onClick={handleDeleteBoard}
          className="text-red-500"
          onClose={() => setIsMenuOpen(false)}
        >
          <FaTrash />
          <span>Delete</span>
        </DropdownItem>
      </DropdownMenu>

      {/* Card Content */}
      <Link
        to={`/app/board?id=${id}`}
        className="absolute inset-0 z-0 flex flex-col justify-between p-4 rounded-lg overflow-hidden transition-opacity group hover:opacity-90"
        aria-label={`Navigate to board ${name}`}
      >
        <div>
          <p className="text-lg sm:text-2xl font-semibold text-gray-800 truncate">
            {name}
          </p>
          {date && (
            <p className="text-sm sm:text-base text-gray-700 mt-1">{date}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          {type === 'draw' ? (
            <MdDraw className="text-2xl text-gray-800" />
          ) : (
            <MdTaskAlt className="text-2xl text-gray-800" />
          )}
          <span className="text-sm sm:text-base text-gray-800 capitalize">
            {type}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-yellow-500 to-transparent opacity-80" />
      </Link>

      {/* Rename Modal */}
      <Modal
        title="Rename Board"
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
      >
        <ModalInput
          value={tempBoardName}
          placeholder="Enter new board name"
          onChange={(e) => {
            setTempBoardName(e.target.value);
          }}
          onEnter={handleRenameBoard}
          maxLength={25}
          showCharCount={true}
        />
        <ModalButton
          onClick={handleRenameBoard}
          disabled={!tempBoardName.trim()}
          className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Save
        </ModalButton>
      </Modal>
    </div>
  );
};

export default BoardCard;
