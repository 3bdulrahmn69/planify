import { useState } from 'react';
import RangeSlider from './RangeSlider';

import {
  FaPen,
  FaShapes,
  FaImage,
  FaDrawPolygon,
  FaEraser,
  FaArrowRight,
  FaArrowLeft,
  FaCircle,
  FaStar,
  FaHandPaper,
} from 'react-icons/fa';
import { IoText } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { RiRectangleFill, RiTriangleFill } from 'react-icons/ri';

interface DrawToolsBoxProps {
  tool: string | null;
  setTool: (tool: string) => void;
  setColor: (color: string) => void;
  setLineSize: (size: number) => void;
  lineSize: number;
}

const DrawToolsBox = ({
  tool,
  setTool,
  setColor,
  lineSize,
  setLineSize,
}: DrawToolsBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShapeOpen, setIsShapeOpen] = useState(false);

  // Toggle the tool box open/close
  const toggleToolBox = () => {
    setIsOpen((prev) => !prev);
  };

  // Toggle the shape options open/close
  const toggleShapeOptions = () => {
    setIsShapeOpen((prev) => !prev);
  };

  const handleToolChange = (newTool: string) => {
    if (newTool === tool) {
      setTool('');
      return;
    }
    setTool(newTool);
  };

  return (
    <div
      className={`fixed top-36 left-0 bg-gray-100 ${
        isOpen ? 'w-48' : 'w-1 '
      } transition-all duration-300 ease-in-out p-4 rounded-lg shadow-md z-30`}
    >
      {/* Arrow Button */}
      <button
        onClick={toggleToolBox}
        className={`absolute top-1/2 right-[-20px]  -translate-y-1/2 flex justify-center items-center bg-black text-white p-2 rounded-full border-none cursor-pointer transition-all duration-300`}
      >
        {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <div className="flex flex-col space-y-4 overflow-hidden">
        <h3 className="text-xl font-bold mb-2 text-gray-700">Tools:</h3>

        {/* Tool Buttons */}
        <button
          onClick={() => handleToolChange('hand')}
          className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
            tool === 'hand' ? 'bg-gray-300' : 'hover:bg-gray-200 '
          }`}
          title="hand Tool"
          aria-label="hand Tool"
        >
          <FaHandPaper /> <span>hand</span>
        </button>
        <button
          onClick={() => handleToolChange('text')}
          className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
            tool === 'text' ? 'bg-gray-300' : 'hover:bg-gray-200 '
          }`}
          title="Text Tool"
          aria-label="Text Tool"
        >
          <IoText /> <span>Text</span>
        </button>
        <button
          onClick={() => handleToolChange('pen')}
          className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
            tool === 'pen' ? 'bg-gray-300' : 'hover:bg-gray-200 '
          }`}
          title="Pen Tool"
          aria-label="Pen Tool"
        >
          <FaPen /> <span>Pen</span>
        </button>
        <RangeSlider value={lineSize} setValue={setLineSize} />
        <button
          onClick={() => handleToolChange('eraser')}
          className={`flex items-center space-x-2 p-3 rounded-md hover:bg-gray-200 transition-colors ${
            tool === 'eraser' ? 'bg-gray-300' : ''
          }`}
          title="Eraser Tool"
          aria-label="Eraser Tool"
        >
          <FaEraser /> <span>Eraser</span>
        </button>
        <button
          onClick={() => handleToolChange('line')}
          className={`flex items-center space-x-2 p-3 rounded-md  transition-colors ${
            tool === 'line' ? 'bg-gray-300' : 'hover:bg-gray-200'
          }`}
          title="Line Tool"
          aria-label="Line Tool"
        >
          <FaDrawPolygon /> <span>Line</span>
        </button>
        <button
          onClick={toggleShapeOptions}
          className={`flex items-center space-x-2 p-3 rounded-md transition-colors`}
          title="Shapes"
          aria-label="Shapes"
        >
          <FaShapes /> <span>Shapes</span>{' '}
          <span className="ml-4 inline-block">
            {isShapeOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        </button>

        {/* Shape options with animation */}
        <div
          className={`space-y-2 mt-3 pl-4 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isShapeOpen ? 'max-h-40' : 'max-h-0'
          }`}
        >
          <div className="flex gap-4">
            <button
              onClick={() => handleToolChange('rectangle')}
              className={`p-2 bg-gray-200 rounded-md w-1/2 grid place-items-center ${
                tool === 'rectangle' ? 'bg-gray-300' : 'hover:bg-gray-200'
              }`}
              title="Rectangle Shape"
              aria-label="Rectangle Shape"
            >
              <RiRectangleFill size={32} />
            </button>
            <button
              onClick={() => handleToolChange('circle')}
              className={`p-2 bg-gray-200 rounded-md w-1/2 grid place-items-center ${
                tool === 'circle' ? 'bg-gray-300' : 'hover:bg-gray-200'
              }`}
              title="Circle Shape"
              aria-label="Circle Shape"
            >
              <FaCircle size={32} />
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleToolChange('star')}
              className={`p-2 bg-gray-200 rounded-md w-1/2 grid place-items-center ${
                tool === 'star' ? 'bg-gray-300' : 'hover:bg-gray-200'
              }`}
              title="Star Shape"
              aria-label="Star Shape"
            >
              <FaStar size={32} />
            </button>
            <button
              onClick={() => handleToolChange('triangle')}
              className={`p-2 bg-gray-200 rounded-md w-1/2 grid place-items-center ${
                tool === 'triangle' ? 'bg-gray-300' : 'hover:bg-gray-200'
              }`}
              title="Triangle Shape"
              aria-label="Triangle Shape"
            >
              <RiTriangleFill size={32} />
            </button>
          </div>
        </div>

        <button
          onClick={() => setTool('image')}
          className={`flex items-center space-x-2 p-3 rounded-md hover:bg-gray-200 transition-colors ${
            tool === 'image' ? 'bg-gray-300' : ''
          }`}
          title="Image Tool"
        >
          <FaImage /> <span>Image</span>
        </button>

        {/* Color Picker */}
        <div className="mt-4">
          <label htmlFor="colorPicker" className="block text-sm text-gray-700">
            Color:
          </label>
          <input
            type="color"
            id="colorPicker"
            onChange={(e) => setColor(e.target.value)}
            className="w-full mt-1 p-1 border rounded-md transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default DrawToolsBox;
