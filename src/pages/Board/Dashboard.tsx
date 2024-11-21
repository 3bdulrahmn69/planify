import { useState, useMemo, lazy, Suspense } from 'react';
import { useDashboardContext } from '../../Context/DashboardContext';
import BoardHeader from './components/BoardHeader';
import { Section, Title } from '../../components/Section';
import { Modal, ModalButton, ModalInput } from '../../components/Modal';
import PlusButton from '../../components/PlusButton';
import CreateBtn from './components/CreateBtn';

import { MdDraw, MdTaskAlt } from 'react-icons/md';

const BoardCard = lazy(() => import('./components/BoardCard')); // Lazy load BoardCard

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

  const boards = useMemo(() => state.boards, [state.boards]);

  return (
    <div className="relative flex flex-col items-center">
      <BoardHeader />

      <main className="w-full">
        <Section
          id="board-manager"
          className="mt-24 flex flex-col items-center w-full px-4 sm:px-8"
        >
          <Title className="mb-6 text-center text-xl sm:text-2xl lg:text-3xl">
            Your Boards
          </Title>

          <div
            className={`w-full max-w-7xl flex flex-wrap justify-start gap-6 ${
              boards.length > 0 ? '' : 'items-center justify-center'
            }`}
          >
            <Suspense
              fallback={
                <div className="text-center col-span-full">
                  <p>Loading boards...</p>
                </div>
              }
            >
              {boards.length > 0 ? (
                boards.map((board) => (
                  <BoardCard
                    key={board.id}
                    id={board.id}
                    name={board.name}
                    date={board.date}
                    type={board.type}
                  />
                ))
              ) : (
                <div className="mt-24 text-gray-500 text-lg flex flex-col items-center justify-center">
                  <p>No boards found. Create one now!</p>
                  <CreateBtn
                    title="Create New Board"
                    onClick={() => setIsBoardModalOpen(true)}
                    className="mt-4 w-fit"
                  />
                </div>
              )}
            </Suspense>
          </div>
        </Section>
      </main>

      {boards.length > 0 && (
        <PlusButton
          title="Create New Board"
          onClick={() => setIsBoardModalOpen(true)}
          className="fixed bottom-8 right-8 sm:bottom-12 sm:right-12"
          size="large"
        />
      )}

      {/* Modals */}
      <Modal
        title="Create New Board"
        isOpen={isBoardModalOpen}
        onClose={handleCloseModal}
      >
        <ModalInput
          value={tempBoardName}
          placeholder="Enter new board name"
          onChange={(e) => setTempBoardName(e.target.value)}
          onEnter={handleCreateBoard}
          maxLength={25}
          showCharCount={true}
        />

        {/* Select Board Type */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
          {/* Task Type */}
          <div
            className={`w-5/12 p-4 border-2 rounded-lg flex flex-col items-center cursor-pointer transition ${
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
            className={`w-5/12 p-4 border-2 rounded-lg flex flex-col items-center cursor-pointer transition ${
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
          className="w-full mt-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </ModalButton>
      </Modal>
    </div>
  );
};

export default Dashboard;
