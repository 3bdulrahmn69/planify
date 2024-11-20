import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDashboardContext } from '../../../Context/DashboardContext';

import { Modal, ModalInput, ModalButton } from '../../../components/Modal';
import { DropdownMenu, DropdownItem } from '../../../components/DropdownMenu';

import PlusButton from '../../../components/PlusButton';
import itemTypes from '../../../lib/itemTypes';

import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TasksBoxProps {
  id: string;
  title: string;
  items: Task[];
}

const TasksBox = ({ id, title, items }: TasksBoxProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const { dispatch } = useDashboardContext();

  const [{ isOver }, drop] = useDrop({
    accept: itemTypes.TASK,
    drop: (item: { id: string; boxId: string }) => {
      dispatch({
        type: 'MOVE_TASK',
        payload: {
          targetBoxId: id,
          taskId: item.id,
        },
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const openDropdown = () => setIsDropdownOpen(true);

  const closeDropdown = () => setIsDropdownOpen(false);

  const handleRename = () => {
    dispatch({
      type: 'RENAME_TASK_BOX',
      payload: { id: id, newName: newTitle },
    });
    setIsRenaming(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK_BOX', payload: { id: id } });
  };

  const openAddTaskModal = () => {
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      dispatch({
        type: 'CREATE_TASK',
        payload: { boxId: id, title: taskTitle },
      });
      setTaskTitle('');
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className={`w-72 h-96 border-2 rounded-lg mx-3 mb-4 relative ${
        isOver ? 'bg-gray-200' : ''
      }`}
      ref={drop}
    >
      {isRenaming ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          className="w-full p-2 text-center border-b"
        />
      ) : (
        <h2 className="text-center mt-2 font-bold">{title}</h2>
      )}

      <div className="p-2">
        {items.map((item, idx) => (
          <TaskItem
            key={item.id}
            boxId={id}
            id={item.id}
            title={item.title}
            status={item.status}
            index={idx}
          />
        ))}
      </div>

      <button className="absolute top-2 right-1" onClick={openDropdown}>
        <HiOutlineDotsVertical />
      </button>

      {/* Dropdown Menu */}
      <DropdownMenu isOpen={isDropdownOpen} onClose={closeDropdown}>
        <DropdownItem
          onClick={() => {
            setIsRenaming(true);
            setIsDropdownOpen(false);
          }}
          onClose={closeDropdown}
        >
          <FaRegEdit />
          <span>Rename</span>
        </DropdownItem>
        <DropdownItem
          onClick={handleDelete}
          className="text-red-500"
          onClose={closeDropdown}
        >
          <FaTrash />
          <span>Delete</span>
        </DropdownItem>
      </DropdownMenu>

      <PlusButton
        title="Add Task"
        onClick={openAddTaskModal}
        className="absolute bottom-2 right-2"
      />

      <Modal
        title="Add Task"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ModalInput
          value={taskTitle}
          placeholder="Enter task title"
          onChange={(e) => setTaskTitle(e.target.value)}
          onEnter={handleAddTask}
        />
        <ModalButton onClick={handleAddTask} disabled={!taskTitle.trim()}>
          Add Task
        </ModalButton>
      </Modal>
    </div>
  );
};

export default TasksBox;
