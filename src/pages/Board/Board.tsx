import { useLocation } from 'react-router-dom';
import { useDashboardContext } from '../../Context/DashboardContext';

const Board = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const { state } = useDashboardContext();

  return (
    <div>
      {state.boards.map((board) =>
        board.id === id ? (
          <div key={board.id}>
            <h1>{board.name}</h1>
            <p>{board.date}</p>
            <p>{board.type}</p>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Board;
