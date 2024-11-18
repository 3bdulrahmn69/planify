import { useState } from 'react';
import { useDashboardContext } from '../../Context/DashboardContext';
import BoardHeader from './components/BoardHeader';
import BoardCard from './components/BoardCard';
import { Section, Title } from '../../components/Section';
import { Modal, ModalButton, ModalInput } from '../../components/Modal';
import PlusButton from '../../components/PlusButton';
import CreateBtn from './components/CreateBtn';

import { MdDraw, MdTaskAlt } from 'react-icons/md';

const Dashboard = () => {
  const { state, dispatch } = useDashboardContext();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [tempBoardName, setTempBoardName] = useState('');
  const [boardType, setBoardType] = useState('');

  const handleCreateBoard = () => {
    if (tempBoardName.trim() && boardType.trim()) {
      dispatch({
        type: 'CREATE_BOARD',
        payload: { name: tempBoardName.trim(), type: boardType.trim() },
      });
      setTempBoardName('');
      setBoardType('');
      setIsBoardModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsBoardModalOpen(false);
    setTempBoardName('');
    setBoardType('');
  };

  return (
    <main className="relative min-h-screen w-full overflow-auto flex flex-col items-center">
      <BoardHeader />
      <Section id="board-manger" className="mt-28">
        <Title className="mb-4">Your Boards</Title>
        <div className="flex flex-wrap gap-4">
          {state.boards.length > 0 ? (
            state.boards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                name={board.name}
                date={board.date}
                type={board.type}
              />
            ))
          ) : (
            <div className="text-gray-500 text-lg w-full h-44 flex flex-col items-center justify-center">
              <p>No boards found. Create one now!</p>
              <CreateBtn
                title="Create New Board"
                onClick={() => setIsBoardModalOpen(true)}
                className="mt-4 w-fit"
              />
            </div>
          )}
        </div>
      </Section>

      <PlusButton
        title="Create New Board"
        onClick={() => setIsBoardModalOpen(true)}
        className="fixed bottom-8 right-8"
        size="large"
      />

      {/* Modals */}
      <Modal
        title="Create New Board"
        isOpen={isBoardModalOpen}
        onClose={handleCloseModal}
      >
        <ModalInput
          value={tempBoardName}
          placeholder="Enter new board name"
          onChange={(e) => {
            setTempBoardName(e.target.value);
          }}
          onEnter={handleCreateBoard}
        />

        {/* Select Board Type */}
        <div className="flex justify-center items-center gap-4 mt-4">
          {/* Task Type */}
          <div
            className={`w-1/2 p-4 border-2 rounded-lg flex flex-col items-center cursor-pointer transition ${
              boardType === 'task'
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300'
            }`}
            onClick={() => setBoardType('task')}
          >
            <MdTaskAlt className="text-4xl text-blue-500" />
            <span className="mt-2 text-gray-700">Task</span>
          </div>

          {/* Draw Type */}
          <div
            className={`w-1/2 p-4 border-2 rounded-lg flex flex-col items-center cursor-pointer transition ${
              boardType === 'draw'
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300'
            }`}
            onClick={() => setBoardType('draw')}
          >
            <MdDraw className="text-4xl text-blue-500" />
            <span className="mt-2 text-gray-700">Draw</span>
          </div>
        </div>

        <ModalButton
          onClick={handleCreateBoard}
          disabled={!tempBoardName.trim() || !boardType.trim()}
          className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Save
        </ModalButton>
      </Modal>
    </main>
  );
};

export default Dashboard;
