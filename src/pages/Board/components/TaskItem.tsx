import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DropdownMenu, DropdownItem } from '../../../components/DropdownMenu';
import { useDashboardContext } from '../../../Context/DashboardContext';

import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import itemTypes from '../../../lib/itemTypes';

interface TaskProps {
  boxId: string;
  id: string;
  title: string;
  status: string;
  order: number; // Add index to track task position
}

const TaskItem = ({ boxId, id, title, status, order }: TaskProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [taskStatus, setTaskStatus] = useState(status);
  const { dispatch } = useDashboardContext();
  const ref = useRef<HTMLDivElement>(null);

  // Drag configuration for DnD
  const [{ isDragging }, drag] = useDrag({
    type: itemTypes.TASK,
    item: { id, boxId, order },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Drop configuration to reorder tasks within the same box
  const [, drop] = useDrop({
    accept: itemTypes.TASK,
    hover: (draggedItem: { id: string; boxId: string; order: number }) => {
      if (draggedItem.id !== id && draggedItem.boxId === boxId) {
        dispatch({
          type: 'REORDER_TASKS',
          payload: {
            boxId,
            sourceIndex: draggedItem.order,
            destinationIndex: order,
          },
        });
        draggedItem.order = order; // Update dragged item’s order after reorder
      }
    },
  });

  drag(drop(ref)); // Connect both drag and drop refs to the component

  const handleRename = () => {
    if (newTitle.trim() !== title) {
      dispatch({
        type: 'RENAME_TASK',
        payload: { taskId: id, boxId, newTitle },
      });
    }
    setIsRenaming(false);
  };

  const handleChangeStatus = () => {
    const newStatus = taskStatus === 'pending' ? 'completed' : 'pending';
    dispatch({
      type: 'CHANGE_TASK_STATUS',
      payload: { taskId: id, newStatus },
    });
    setTaskStatus(newStatus);
  };

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_TASK',
      payload: { taskId: id },
    });
  };

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between p-2 rounded-md relative mb-2 
        ${
          taskStatus === 'completed'
            ? 'bg-gray-100 text-gray-500 line-through'
            : 'bg-blue-500 text-white'
        } 
        ${isDragging ? 'opacity-50' : ''}`}
    >
      {isRenaming ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          className="w-full p-1 border rounded-md text-black"
          autoFocus
        />
      ) : (
        <span
          onClick={handleChangeStatus}
          className={`flex-1 cursor-pointer select-none ${
            taskStatus === 'completed' ? 'line-through text-gray-500' : ''
          }`}
        >
          {title}
        </span>
      )}

      <button
        className="p-1 hover:text-gray-600"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <HiOutlineDotsVertical />
      </button>

      <DropdownMenu
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      >
        <DropdownItem
          onClick={() => setIsRenaming(true)}
          onClose={() => setIsDropdownOpen(false)}
        >
          <FaRegEdit />
          <span>Rename</span>
        </DropdownItem>
        <DropdownItem
          onClick={handleDelete}
          className="text-red-500"
          onClose={() => setIsDropdownOpen(false)}
        >
          <FaTrash />
          <span>Delete</span>
        </DropdownItem>
      </DropdownMenu>
    </div>
  );
};

export default TaskItem;
