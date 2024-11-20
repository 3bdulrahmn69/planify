import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import BoardHeader from './components/BoardHeader';
import TaskBoard from './components/TaskBoard';
import TasksBox from './components/TasksBox';
import { Modal, ModalButton, ModalInput } from '../../components/Modal';
import { useDashboardContext } from '../../Context/DashboardContext';
import PlusButton from '../../components/PlusButton';

const Board = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const { state, dispatch } = useDashboardContext();
  const board = state.boards.find((board) => board.id === id);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [tempTaskBoxName, setTaskBoxName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [tempBoardName, setTempBoardName] = useState(board?.name);

  const handleCloseBoardModal = () => {
    setIsBoardModalOpen(false);
    setTaskBoxName('');
  };

  const handleCloseRenameModal = () => {
    setIsRenameModalOpen(false);
    setTempBoardName(board?.name);
  };

  const handleCreateTaskBox = () => {
    if (tempTaskBoxName.trim()) {
      dispatch({
        type: 'CREATE_TASK_BOX',
        payload: { boardId: id, name: tempTaskBoxName.trim() },
      });
      setTaskBoxName('');
      setIsBoardModalOpen(false);
    }
  };

  const handleRenameBoard = () => {
    if (tempBoardName.trim()) {
      dispatch({
        type: 'RENAME_BOARD',
        payload: { id, newName: tempBoardName.trim() },
      });
      setTempBoardName(tempBoardName.trim());
      setIsRenameModalOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-auto flex flex-col items-center">
      <BoardHeader
        variant="detailed"
        boardName={board?.name}
        onEdit={() => {
          setIsRenameModalOpen(true);
        }}
      />
      <main className="mt-28 w-full">
        <TaskBoard>
          {state.taskBoxes
            .filter((taskBox) => taskBox.boardId === id)
            .map((taskBox) => (
              <TasksBox
                key={taskBox.id}
                id={taskBox.id}
                title={taskBox.name}
                items={state.tasks.filter((task) => task.boxId === taskBox.id)}
              />
            ))}

          <PlusButton
            title="Create New Board"
            onClick={() => setIsBoardModalOpen(true)}
            className="fixed bottom-8 right-8"
            size="large"
          />

          {/* Modals */}
          <Modal
            title="Create New Task Box"
            isOpen={isBoardModalOpen}
            onClose={handleCloseBoardModal}
          >
            <ModalInput
              value={tempTaskBoxName}
              placeholder="Enter task box name"
              onChange={(e) => {
                setTaskBoxName(e.target.value);
              }}
              onEnter={handleCreateTaskBox}
              maxLength={25}
              showCharCount={true}
            />
            <ModalButton
              onClick={handleCreateTaskBox}
              disabled={!tempTaskBoxName.trim()}
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Save
            </ModalButton>
          </Modal>

          <Modal
            title="Rename Board"
            isOpen={isRenameModalOpen}
            onClose={handleCloseRenameModal}
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
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Save
            </ModalButton>
          </Modal>
        </TaskBoard>
      </main>
    </div>
  );
};

export default Board;
