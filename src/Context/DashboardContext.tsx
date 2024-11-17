import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CREATE_BOARD = 'CREATE_BOARD';
const DELETE_BOARD = 'DELETE_BOARD';
const RENAME_BOARD = 'RENAME_BOARD';

const initialState = {
  boards: JSON.parse(localStorage.getItem('boards')) || [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case CREATE_BOARD: {
      const newBoard = {
        id: uuidv4(),
        name: action.payload.name,
        date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      };
      const updatedBoards = [...state.boards, newBoard];
      localStorage.setItem('boards', JSON.stringify(updatedBoards)); // Update localStorage
      return {
        ...state,
        boards: updatedBoards,
      };
    }
    case DELETE_BOARD: {
      const updatedBoards = state.boards.filter(
        (board) => board.id !== action.payload.id
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards)); // Update localStorage
      return {
        ...state,
        boards: updatedBoards,
      };
    }
    case RENAME_BOARD: {
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id
            ? {
                ...board,
                name: action.payload.newName,
                date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
              }
            : board
        ),
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Sync state with localStorage whenever boards change
  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(state.boards));
  }, [state.boards]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider'
    );
  }
  return context;
};
