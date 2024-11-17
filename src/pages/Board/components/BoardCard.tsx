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

interface BoardCardProps {
  name: string;
  id: string;
  date?: string;
}

const BoardCard = ({ name, id, date }: BoardCardProps) => {
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
    <div className="relative h-48 w-96 rounded-lg bg-yellow-300 shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 overflow-hidden">
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
          <span>Edit</span>
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
        to={`/app/${id}`}
        className="absolute inset-0 z-0 rounded-lg overflow-hidden"
        aria-label={`Navigate to board ${name}`}
      >
        <div className="h-full w-full flex items-center justify-center flex-col transition-opacity group-hover:opacity-80 p-4">
          <p className="text-2xl font-semibold text-gray-800">{name}</p>
          {date && <p className="text-xs text-gray-600">{date}</p>}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-yellow-400 to-transparent" />
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
