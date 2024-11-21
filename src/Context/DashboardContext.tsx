import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/* Board Actions */
const CREATE_BOARD = 'CREATE_BOARD';
const DELETE_BOARD = 'DELETE_BOARD';
const RENAME_BOARD = 'RENAME_BOARD';
/* TaskBox Actions */
const CREATE_TASK_BOX = 'CREATE_TASK_BOX';
const DELETE_TASK_BOX = 'DELETE_TASK_BOX';
const RENAME_TASK_BOX = 'RENAME_TASK_BOX';
/* Task Actions */
const CREATE_TASK = 'CREATE_TASK';
const CHANGE_TASK_STATUS = 'CHANGE_TASK_STATUS';
const DELETE_TASK = 'DELETE_TASK';
const RENAME_TASK = 'RENAME_TASK';
const MOVE_TASK = 'MOVE_TASK';
const REORDER_TASKS = 'REORDER_TASKS';

const initialState = {
  boards: JSON.parse(localStorage.getItem('boards') || '[]'),
  taskBoxes: JSON.parse(localStorage.getItem('taskBoxes') || '[]'),
  tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
};

interface Action {
  type: string;
  payload: any;
}

interface State {
  boards: Board[];
  taskBoxes: TaskBox[];
  tasks: Task[];
}

interface Board {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface TaskBox {
  id: string;
  name: string;
  boardId: string;
}

interface Task {
  id: string;
  title: string;
  boxId: string;
  status: string;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    /* Board Actions */
    case CREATE_BOARD: {
      const newBoard = {
        id: uuidv4(),
        name: action.payload.name,
        type: action.payload.type,
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
      const updatedBoards = state.boards.map((board) =>
        board.id === action.payload.id
          ? {
              ...board,
              name: action.payload.newName,
              date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
            }
          : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards)); // Sync to localStorage
      return {
        ...state,
        boards: updatedBoards,
      };
    }
    /* TaskBox Actions */
    case CREATE_TASK_BOX: {
      const newTaskBox = {
        id: uuidv4(),
        name: action.payload.name,
        boardId: action.payload.boardId,
      };
      const updatedTaskBoxes = [...state.taskBoxes, newTaskBox];
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes)); // Update localStorage
      return {
        ...state,
        taskBoxes: updatedTaskBoxes,
      };
    }
    case DELETE_TASK_BOX: {
      const updatedTaskBoxes = state.taskBoxes.filter(
        (taskBox) => taskBox.id !== action.payload.id
      );
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes)); // Update localStorage
      return {
        ...state,
        taskBoxes: updatedTaskBoxes,
      };
    }
    case RENAME_TASK_BOX: {
      const updatedTaskBoxes = state.taskBoxes.map((taskBox) =>
        taskBox.id === action.payload.id
          ? { ...taskBox, name: action.payload.newName }
          : taskBox
      );
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes)); // Update localStorage
      return {
        ...state,
        taskBoxes: updatedTaskBoxes,
      };
    }
    /* Task Actions */
    case CREATE_TASK: {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        boxId: action.payload.boxId,
        status: 'pending',
      };
      const updatedTasks = [...state.tasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case CHANGE_TASK_STATUS: {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, status: action.payload.newStatus }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case DELETE_TASK: {
      const updatedTasks = state.tasks.filter(
        (task) => task.id !== action.payload.taskId
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case RENAME_TASK: {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, title: action.payload.newTitle }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case MOVE_TASK: {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, boxId: action.payload.targetBoxId }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case REORDER_TASKS: {
      const updatedTasks = [...state.tasks];
      const [draggedItem] = updatedTasks.splice(action.payload.sourceIndex, 1);
      updatedTasks.splice(action.payload.destinationIndex, 0, draggedItem);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage
      return {
        ...state,
        tasks: updatedTasks,
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
