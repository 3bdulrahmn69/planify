import { useState, useEffect, useCallback } from 'react';
import {
  FaHandPaper,
  FaPen,
  FaEraser,
  FaDrawPolygon,
  FaShapes,
  FaImage,
  FaArrowRight,
  FaArrowLeft,
} from 'react-icons/fa';
import { IoText } from 'react-icons/io5';

interface DrawToolsBoxProps {
  tool: string | null;
  setTool: (tool: string) => void;
  isKeyboardShortcutsDisable?: boolean;
}

const DEBOUNCE_DELAY = 150; // milliseconds

const DrawToolsBox = ({
  tool,
  setTool,
  isKeyboardShortcutsDisable,
}: DrawToolsBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  // Toggle the toolbox open/close
  const toggleToolBox = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle tool change
  const handleToolChange = useCallback(
    (newTool: string) => {
      if (newTool === tool) {
        setTool('');
        return;
      }
      setTool(newTool);
    },
    [tool, setTool]
  );

  // Add keyboard shortcuts with debounce
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isKeyboardShortcutsDisable) return;

      const currentTime = Date.now();
      if (currentTime - lastKeyTime < DEBOUNCE_DELAY) {
        return;
      }
      setLastKeyTime(currentTime);

      // Check for Space key (both " " and "Space")
      if (event.key === ' ' || event.key === 'Space') {
        event.preventDefault(); // Prevent default scrolling behavior
        setTool('hand');
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'r':
          handleToolChange('');
          break;
        case 'p':
          handleToolChange('pen');
          break;
        case 'h':
          handleToolChange('hand');
          break;
        case 'e':
          handleToolChange('eraser');
          break;
        case 'a':
          handleToolChange('text');
          break;
        case 'l':
          handleToolChange('line');
          break;
        case 's':
          handleToolChange('shapes');
          break;
        case 'i':
          handleToolChange('image');
          break;
        case 't':
          toggleToolBox();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Check for Space key (both " " and "Space")
      if (event.key === ' ' || event.key === 'Space') {
        setTool('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    tool,
    handleToolChange,
    lastKeyTime,
    toggleToolBox,
    isKeyboardShortcutsDisable,
    setTool,
  ]);

  // Click handler to avoid inline functions in JSX
  const handleClick = (toolName: string) => () => {
    handleToolChange(toolName);
  };

  return (
    <div className="fixed top-1/3 -translate-y-1/2 w-36 left-0 p-4 rounded-lg z-30">
      <button
        aria-label="Toggle Tool Box"
        tabIndex={0}
        className="absolute top-36 left-2 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white"
        onClick={toggleToolBox}
      >
        {isOpen ? <FaArrowLeft size={18} /> : <FaArrowRight size={18} />}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? 'transform translate-x-0 opacity-100 visible'
            : 'transform -translate-x-full opacity-0 invisible'
        }`}
      >
        <button
          aria-label="Hand Tool"
          tabIndex={0}
          className={`absolute top-4 left-2 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'hand' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('hand')}
        >
          <FaHandPaper size={18} />
        </button>

        <button
          aria-label="Pen Tool"
          tabIndex={0}
          className={`absolute top-12 left-12 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'pen' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('pen')}
        >
          <FaPen size={18} />
        </button>

        <button
          aria-label="Eraser Tool"
          tabIndex={0}
          className={`absolute top-24 left-20 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'eraser' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('eraser')}
        >
          <FaEraser size={18} />
        </button>

        <button
          aria-label="Text Tool"
          tabIndex={0}
          className={`absolute top-36 left-28 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'text' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('text')}
        >
          <IoText size={18} />
        </button>

        <button
          aria-label="Line Tool"
          tabIndex={0}
          className={`absolute top-48 left-20 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'line' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('line')}
        >
          <FaDrawPolygon size={18} />
        </button>

        <button
          aria-label="Shapes Tool"
          tabIndex={0}
          className={`absolute top-56 left-12 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'shapes' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('shapes')}
        >
          <FaShapes size={18} />
        </button>

        <button
          aria-label="Image Tool"
          tabIndex={0}
          className={`absolute top-64 left-2 bg-black rounded-full flex items-center justify-center w-9 h-9 text-white transition-transform ${
            tool === 'image' ? 'bg-blue-500' : ''
          } hover:scale-110 hover:border-blue-500 border-2`}
          onClick={handleClick('image')}
        >
          <FaImage size={18} />
        </button>
      </div>
    </div>
  );
};

export default DrawToolsBox;
