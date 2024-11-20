interface TaskBoardProps {
  children: React.ReactNode;
}

const TaskBoard = ({ children }: TaskBoardProps) => {
  return <div className="flex w-full">{children}</div>;
};

export default TaskBoard;
