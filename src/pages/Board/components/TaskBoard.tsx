import { cn } from '../../../lib/utils';

interface TaskBoardProps {
  children: React.ReactNode;
  className?: string;
}

const TaskBoard = ({ className, children }: TaskBoardProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default TaskBoard;
