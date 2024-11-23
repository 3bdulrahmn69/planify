import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

/* Interfaces */
import { Board, TaskBox, Task } from '../lib/interfaces';

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

interface State {
  boards: Board[];
  taskBoxes: TaskBox[];
  tasks: Task[];
}

interface Action {
  type: string;
  payload: any;
}

const initialState: State = {
  boards: JSON.parse(localStorage.getItem('boards') || '[]'),
  taskBoxes: JSON.parse(localStorage.getItem('taskBoxes') || '[]'),
  tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    /* Board Actions */
    case CREATE_BOARD: {
      const newBoard: Board = {
        id: uuidv4(),
        name: action.payload.name,
        type: action.payload.type,
        date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      };
      const updatedBoards = [...state.boards, newBoard];
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { ...state, boards: updatedBoards };
    }
    case DELETE_BOARD: {
      // Delete task boxes related to the board
      const updatedTaskBoxes = state.taskBoxes.filter(
        (taskBox) => taskBox.boardId !== action.payload.id
      );

      // Delete tasks related to the deleted task boxes
      const taskBoxesToDelete = state.taskBoxes
        .filter((taskBox) => taskBox.boardId === action.payload.id)
        .map((taskBox) => taskBox.id);

      const updatedTasks = state.tasks.filter(
        (task) => !taskBoxesToDelete.includes(task.boxId)
      );

      // Update localStorage for boards, taskBoxes, and tasks
      localStorage.setItem(
        'boards',
        JSON.stringify(
          state.boards.filter((board) => board.id !== action.payload.id)
        )
      );
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes));
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload.id),
        taskBoxes: updatedTaskBoxes,
        tasks: updatedTasks,
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
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { ...state, boards: updatedBoards };
    }
    /* TaskBox Actions */
    case CREATE_TASK_BOX: {
      const newTaskBox: TaskBox = {
        id: uuidv4(),
        name: action.payload.name,
        boardId: action.payload.boardId,
      };
      const updatedTaskBoxes = [...state.taskBoxes, newTaskBox];
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes));
      return { ...state, taskBoxes: updatedTaskBoxes };
    }
    case DELETE_TASK_BOX: {
      // Delete tasks associated with the task box
      const updatedTasks = state.tasks.filter(
        (task) => task.boxId !== action.payload.id
      );

      // Update localStorage for tasks
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // Remove the task box itself
      const updatedTaskBoxes = state.taskBoxes.filter(
        (taskBox) => taskBox.id !== action.payload.id
      );

      // Update localStorage for task boxes
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes));

      return {
        ...state,
        taskBoxes: updatedTaskBoxes,
        tasks: updatedTasks,
      };
    }
    case RENAME_TASK_BOX: {
      const updatedTaskBoxes = state.taskBoxes.map((taskBox) =>
        taskBox.id === action.payload.id
          ? { ...taskBox, name: action.payload.newName }
          : taskBox
      );
      localStorage.setItem('taskBoxes', JSON.stringify(updatedTaskBoxes));
      return { ...state, taskBoxes: updatedTaskBoxes };
    }
    /* Task Actions */
    case CREATE_TASK: {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        boxId: action.payload.boxId,
        status: 'pending',
        order: state.tasks.filter((task) => task.boxId === action.payload.boxId)
          .length,
      };
      const updatedTasks = [...state.tasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case CHANGE_TASK_STATUS: {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, status: action.payload.newStatus }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case DELETE_TASK: {
      const updatedTasks = state.tasks.filter(
        (task) => task.id !== action.payload.taskId
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case RENAME_TASK: {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, title: action.payload.newTitle }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case MOVE_TASK: {
      const { taskId, targetBoxId } = action.payload;

      // Find the task to move
      const taskToMove = state.tasks.find((task) => task.id === taskId);

      if (!taskToMove) {
        console.error('Task not found');
        return state;
      }

      // If the target box is the same as the current box, do nothing
      if (taskToMove.boxId === targetBoxId) {
        return state;
      }

      // Update tasks
      const updatedTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          // Move the task to the target box and assign the next order
          return {
            ...task,
            boxId: targetBoxId,
            order: state.tasks.filter((t) => t.boxId === targetBoxId).length,
          };
        }

        // Re-index tasks in the source box
        if (task.boxId === taskToMove.boxId) {
          return {
            ...task,
            order: state.tasks
              .filter((t) => t.boxId === task.boxId && t.id !== taskId)
              .sort((a, b) => a.order - b.order)
              .findIndex((t) => t.id === task.id),
          };
        }

        return task;
      });

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    case REORDER_TASKS: {
      const { boxId, sourceIndex, destinationIndex } = action.payload;

      // Filter and reorder tasks in the same box
      const tasksInBox = state.tasks.filter((task) => task.boxId === boxId);
      const [movedTask] = tasksInBox.splice(sourceIndex, 1);
      tasksInBox.splice(destinationIndex, 0, movedTask);

      // Reassign order values
      tasksInBox.forEach((task, index) => {
        task.order = index;
      });

      // Merge updated tasks back into the global state
      const updatedTasks = state.tasks.map((task) =>
        task.boxId === boxId
          ? tasksInBox.find((t) => t.id === task.id) || task
          : task
      );

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

interface DashboardContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(state.boards));
  }, [state.boards]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider'
    );
  }
  return context;
};
