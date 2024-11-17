import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Action Types 1. modal
const OPEN_BOARD_MODAL = 'OPEN_BOARD_MODAL';
const OPEN_TASK_MODAL = 'OPEN_TASK_MODAL';
const CLOSE_BOARD_MODAL = 'CLOSE_BOARD_MODAL';
const CLOSE_TASK_MODAL = 'CLOSE_TASK_MODAL';
// 2. board
const SET_BOARD_NAME = 'SET_BOARD_NAME';
const SET_TEMP_BOARD_NAME = 'SET_TEMP_BOARD_NAME';
//3. task box
const ADD_TASK_BOX = 'ADD_TASK_BOX';
const RENAME_TASK_BOX = 'RENAME_TASK_BOX';
const DELETE_TASK_BOX = 'DELETE_TASK_BOX';
// 4. tasks
const ADD_SUBTASK = 'ADD_SUBTASK';
const DEFAULT_SUBTASK_TITLE = 'Untitled Subtask';
const SET_NEW_TASK_NAME = 'SET_NEW_TASK_NAME';
const MOVE_TASK = 'MOVE_TASK';
const REORDER_TASK = 'REORDER_TASK';
const RENAME_TASK = 'RENAME_TASK';
const DELETE_TASK = 'DELETE_TASK';

// State Interfaces
interface Subtask {
  id: string;
  title: string;
}

interface TaskBox {
  id: string;
  title: string;
  items: Subtask[];
}

interface State {
  boardName: string;
  tempBoardName: string;
  tasks: TaskBox[];
  isBoardModalOpen: boolean;
  isTaskModalOpen: boolean;
  newTaskName: string;
}

// Initial State
const initialState: State = {
  boardName: 'Board Name',
  tempBoardName: '',
  tasks: [],
  isBoardModalOpen: false,
  isTaskModalOpen: false,
  newTaskName: '',
};

// Action Interface
interface Action {
  type: string;
  payload?: {
    boxId?: string;
    title?: string;
    newTitle?: string;
    sourceBoxId?: string;
    targetBoxId?: string;
    taskId?: string;
    sourceIndex?: number;
    destinationIndex?: number;
  };
}

// Reducer Function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case OPEN_BOARD_MODAL:
      return {
        ...state,
        isBoardModalOpen: true,
        tempBoardName: state.boardName,
      };
    case OPEN_TASK_MODAL:
      return { ...state, isTaskModalOpen: true, newTaskName: '' };
    case CLOSE_BOARD_MODAL:
      return { ...state, isBoardModalOpen: false };
    case CLOSE_TASK_MODAL:
      return { ...state, isTaskModalOpen: false };
    // 2. board
    case SET_BOARD_NAME:
      return {
        ...state,
        boardName: state.tempBoardName,
        isBoardModalOpen: false,
      };
    case SET_TEMP_BOARD_NAME: {
      const { title = state.tempBoardName } = action.payload || {};
      return { ...state, tempBoardName: title };
    }
    // 3. task box
    case ADD_TASK_BOX:
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: uuidv4(), title: state.newTaskName, items: [] },
        ],
        isTaskModalOpen: false,
        newTaskName: '',
      };
    case RENAME_TASK_BOX:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload?.boxId
            ? { ...task, title: action.payload?.newTitle || task.title }
            : task
        ),
      };
    case DELETE_TASK_BOX:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload?.boxId),
      };
    // 4. tasks
    case ADD_SUBTASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload?.boxId
            ? {
                ...task,
                items: [
                  ...task.items,
                  {
                    id: uuidv4(),
                    title: action.payload?.title ?? DEFAULT_SUBTASK_TITLE,
                  },
                ],
              }
            : task
        ),
      };
    case SET_NEW_TASK_NAME: {
      const { title = '' } = action.payload || {};
      return { ...state, newTaskName: title };
    }
    case MOVE_TASK: {
      const { sourceBoxId, targetBoxId, taskId } = action.payload || {};

      // If the source and target box are the same, do nothing
      if (sourceBoxId === targetBoxId) return state;

      let taskToMove: Subtask | null = null;

      // Find and remove the task from the source box
      const updatedTasks = state.tasks.map((box) => {
        if (box.id === sourceBoxId) {
          const newItems = box.items.filter((item) => {
            if (item.id === taskId) {
              taskToMove = item;
              return false;
            }
            return true;
          });
          return { ...box, items: newItems };
        }
        return box;
      });

      // If task was found and we have a valid target box, add it to the target box
      return {
        ...state,
        tasks: updatedTasks.map((box) =>
          box.id === targetBoxId && taskToMove
            ? { ...box, items: [...box.items, taskToMove] }
            : box
        ),
      };
    }
    case REORDER_TASK: {
      const {
        boxId = '',
        sourceIndex = 0,
        destinationIndex = 0,
      } = action.payload || {};
      const box = state.tasks.find((taskBox) => taskBox.id === boxId);
      if (!box) return state;

      const updatedItems = [...box.items];
      const [movedTask] = updatedItems.splice(sourceIndex, 1);
      updatedItems.splice(destinationIndex, 0, movedTask);

      return {
        ...state,
        tasks: state.tasks.map((taskBox) =>
          taskBox.id === boxId ? { ...taskBox, items: updatedItems } : taskBox
        ),
      };
    }
    case RENAME_TASK: {
      const { taskId, boxId, newTitle } = action.payload || {};
      return {
        ...state,
        tasks: state.tasks.map((taskBox) =>
          taskBox.id === boxId
            ? {
                ...taskBox,
                items: taskBox.items.map((subtask) =>
                  subtask.id === taskId
                    ? { ...subtask, title: newTitle || subtask.title } // Update the title of the task
                    : subtask
                ),
              }
            : taskBox
        ),
      };
    }
    case DELETE_TASK: {
      const { taskId, boxId } = action.payload || {};
      return {
        ...state,
        tasks: state.tasks.map((taskBox) =>
          taskBox.id === boxId
            ? {
                ...taskBox,
                items: taskBox.items.filter((subtask) => subtask.id !== taskId),
              }
            : taskBox
        ),
      };
    }
    default:
      console.error('Invalid Action Type');
      return state;
  }
}

// Context Creation
const BoardContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addSubtask: (boxId: string, title: string) => void;
} | null>(null);

// Provider Component
export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Add a subtask within a specific box
  const addSubtask = (boxId: string, title: string) => {
    dispatch({ type: ADD_SUBTASK, payload: { boxId, title } });
  };

  return (
    <BoardContext.Provider value={{ state, dispatch, addSubtask }}>
      {children}
    </BoardContext.Provider>
  );
};

// Custom Hook to Use Context
export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
