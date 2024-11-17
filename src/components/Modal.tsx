import { ReactNode, useRef, useEffect, forwardRef } from 'react';
import { FiX } from 'react-icons/fi';
import { cn } from '../lib/utils';

/* Modal Component */
interface ModalProps {
  title: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export const Modal = ({
  title,
  isOpen,
  onClose,
  children,
  className,
  titleClassName,
  contentClassName,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'backdrop:bg-black/50 bg-white rounded-lg p-6 max-w-lg w-full mx-auto shadow-lg transition-all duration-300',
        className
      )}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2
          id="modal-title"
          className={cn('text-2xl font-bold text-gray-800', titleClassName)}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FiX size={24} />
        </button>
      </div>
      <div className={cn('modal-content', contentClassName)}>{children}</div>
    </dialog>
  );
};

/* ModalInput Component */
interface ModalInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
}

export const ModalInput = forwardRef<HTMLInputElement, ModalInputProps>(
  (
    { value, onChange, onEnter, placeholder = 'Enter value', className },
    ref
  ) => {
    return (
      <input
        type="text"
        ref={ref}
        className={cn(
          'w-full p-2 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-all',
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onEnter && onEnter()}
        autoFocus={true}
      />
    );
  }
);

/* ModalButton Component */
interface ModalButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const ModalButton: React.FC<ModalButtonProps> = ({
  onClick,
  className,
  disabled = false,
  children,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed',
      className
    )}
  >
    {children}
  </button>
);
